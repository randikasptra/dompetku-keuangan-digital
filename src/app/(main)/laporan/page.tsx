import { and, desc, eq, gte, lt } from 'drizzle-orm';
import { ArrowDownRight, ArrowUpRight, PiggyBank, Scale, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';

import { db } from '@/db/client';
import { categories, transactions } from '@/db/schema';
import { formatRupiah } from '@/lib/format';
import { MONTH_NAMES } from '@/lib/constants';
import { createServerSupabaseClient } from '@/lib/supabase';

type SearchParams = Promise<{ month?: string }>;

function getMonthValue() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
  })
    .format(new Date())
    .slice(0, 7);
}

export default async function LaporanPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selectedMonth = /^\d{4}-\d{2}$/.test(params.month ?? '')
    ? params.month!
    : getMonthValue();
  const [year, month] = selectedMonth.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const rows = await db
    .select({
      id: transactions.id,
      title: transactions.title,
      amount: transactions.amount,
      type: transactions.type,
      date: transactions.date,
      category: categories.name,
      group: categories.group,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, user.id),
        gte(transactions.date, start),
        lt(transactions.date, end)
      )
    )
    .orderBy(desc(transactions.amount));

  const income = rows
    .filter((row) => row.type === 'INCOME')
    .reduce((sum, row) => sum + row.amount, 0);
  const expenseRows = rows.filter((row) => row.type === 'EXPENSE');
  const expense = expenseRows.reduce((sum, row) => sum + row.amount, 0);
  const needs = expenseRows
    .filter((row) => row.group === 'NEEDS')
    .reduce((sum, row) => sum + row.amount, 0);
  const wants = expenseRows
    .filter((row) => row.group === 'WANTS')
    .reduce((sum, row) => sum + row.amount, 0);
  const balance = income - expense;
  const expenseBase = expense || 1;
  const needsPercent = Math.round((needs / expenseBase) * 100);

  const categoryTotals = Object.entries(
    expenseRows.reduce<Record<string, number>>((totals, row) => {
      totals[row.category] = (totals[row.category] ?? 0) + row.amount;
      return totals;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const largestCategory = categoryTotals[0]?.[1] ?? 1;

  const cards = [
    {
      label: 'Pemasukan',
      value: income,
      icon: ArrowUpRight,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Pengeluaran',
      value: expense,
      icon: ArrowDownRight,
      color: 'bg-red-50 text-red-600',
    },
    {
      label: 'Sisa uang',
      value: balance,
      icon: PiggyBank,
      color: balance >= 0 ? 'bg-sky-100 text-sky-700' : 'bg-red-50 text-red-600',
    },
    {
      label: 'Rasio pengeluaran',
      value: income ? Math.round((expense / income) * 100) : 0,
      icon: Scale,
      color: 'bg-amber-100 text-amber-700',
      percent: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Ringkasan bulanan</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {MONTH_NAMES[month - 1]} {year}
          </p>
        </div>
        <form>
          <input
            type="month"
            name="month"
            defaultValue={selectedMonth}
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="brand-gradient brand-gradient-hover ml-2 h-10 rounded-lg px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-violet-500/20">
            Lihat
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-xl border bg-card p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <span className={`rounded-full p-2 ${card.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 text-lg font-bold sm:text-xl">
                {card.percent ? `${card.value}%` : formatRupiah(card.value)}
              </p>
            </article>
          );
        })}
      </div>

      {!rows.length ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">Belum ada data bulan ini</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Laporan akan terbentuk otomatis setelah kamu mencatat transaksi.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            <article className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="font-bold">Kebutuhan vs Keinginan</h2>
              <div className="mt-4 flex items-center gap-4">
                <div
                  className="relative h-28 w-28 shrink-0 rounded-full"
                  style={{
                    background: `conic-gradient(hsl(var(--primary)) 0 ${needsPercent}%, #f59e0b ${needsPercent}% 100%)`,
                  }}
                >
                  <div className="absolute inset-5 flex items-center justify-center rounded-full bg-card text-center">
                    <span className="text-lg font-bold">{formatRupiah(expense)}</span>
                  </div>
                </div>
                <dl className="min-w-0 flex-1 space-y-4">
                  <div>
                    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      Kebutuhan ({needsPercent}%)
                    </dt>
                    <dd className="mt-1 font-bold">{formatRupiah(needs)}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-3 w-3 rounded-full bg-amber-500" />
                      Keinginan ({100 - needsPercent}%)
                    </dt>
                    <dd className="mt-1 font-bold">{formatRupiah(wants)}</dd>
                  </div>
                </dl>
              </div>
            </article>

            <article className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="font-bold">Pengeluaran per kategori</h2>
              <div className="mt-5 space-y-4">
                {categoryTotals.length ? (
                  categoryTotals.map(([name, total]) => (
                    <div key={name}>
                      <div className="mb-1.5 flex justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{name}</span>
                        <span className="font-semibold">{formatRupiah(total)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(4, (total / largestCategory) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada pengeluaran.</p>
                )}
              </div>
            </article>
          </div>

          <article className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="font-bold">Transaksi terbesar</h2>
            <div className="mt-4 divide-y">
              {rows.slice(0, 5).map((row) => (
                <div key={row.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{row.title}</p>
                    <p className="text-sm text-muted-foreground">{row.category}</p>
                  </div>
                  <p
                    className={`font-bold ${
                      row.type === 'INCOME' ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {row.type === 'INCOME' ? '+' : '−'}
                    {formatRupiah(row.amount)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  );
}
