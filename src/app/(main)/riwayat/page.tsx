import { and, desc, eq, gte, ilike, lt } from 'drizzle-orm';
import { Search, SlidersHorizontal, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { DeleteTransactionButton } from '@/components/forms/DeleteTransactionButton';
import { db } from '@/db/client';
import { categories, paymentMethods, transactions } from '@/db/schema';
import { formatDate, formatRupiah } from '@/lib/format';
import { createServerSupabaseClient } from '@/lib/supabase';

type SearchParams = Promise<{
  q?: string;
  type?: string;
  month?: string;
}>;

function currentMonth() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
  })
    .format(new Date())
    .slice(0, 7);
}

function monthRange(month: string) {
  const safeMonth = /^\d{4}-\d{2}$/.test(month) ? month : currentMonth();
  const [year, monthNumber] = safeMonth.split('-').map(Number);
  return {
    value: safeMonth,
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  };
}

export default async function RiwayatPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const range = monthRange(params.month ?? currentMonth());
  const type = params.type === 'INCOME' || params.type === 'EXPENSE' ? params.type : undefined;
  const search = params.q?.trim();
  const conditions = [
    eq(transactions.userId, user.id),
    gte(transactions.date, range.start),
    lt(transactions.date, range.end),
  ];
  if (type) conditions.push(eq(transactions.type, type));
  if (search) conditions.push(ilike(transactions.title, `%${search}%`));

  const rows = await db
    .select({
      id: transactions.id,
      title: transactions.title,
      amount: transactions.amount,
      type: transactions.type,
      date: transactions.date,
      note: transactions.note,
      category: categories.name,
      group: categories.group,
      paymentMethod: paymentMethods.name,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .innerJoin(paymentMethods, eq(transactions.paymentMethodId, paymentMethods.id))
    .where(and(...conditions))
    .orderBy(desc(transactions.date), desc(transactions.createdAt));

  const grouped = rows.reduce((groups, row) => {
    const key = row.date.toISOString().slice(0, 10);
    const items = groups.get(key) ?? [];
    items.push(row);
    groups.set(key, items);
    return groups;
  }, new Map<string, typeof rows>());

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-primary">Semua catatanmu</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Riwayat Transaksi</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} transaksi ditemukan</p>
      </div>

      <form className="rounded-xl border bg-card p-3 shadow-sm">
        <div className="grid gap-2.5 sm:grid-cols-[1fr_150px_150px_auto]">
          <label className="relative">
            <span className="sr-only">Cari transaksi</span>
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={search}
              placeholder="Cari transaksi..."
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <input
            type="month"
            name="month"
            defaultValue={range.value}
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            name="type"
            defaultValue={type ?? ''}
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Semua jenis</option>
            <option value="EXPENSE">Pengeluaran</option>
            <option value="INCOME">Pemasukan</option>
          </select>
          <button className="brand-gradient brand-gradient-hover inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-violet-500/20">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Terapkan
          </button>
        </div>
      </form>

      {!rows.length ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <WalletCards className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">Belum ada transaksi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Catat transaksi atau coba ubah filter periode.
          </p>
          <Link
            href="/catat"
            className="brand-gradient brand-gradient-hover mt-5 inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold text-primary-foreground shadow-sm shadow-violet-500/20"
          >
            Catat transaksi
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([date, items]) => (
            <section key={date}>
              <h2 className="mb-3 text-sm font-bold text-muted-foreground">
                {formatDate(`${date}T12:00:00+07:00`)}
              </h2>
              <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {items.map((item, index) => (
                  <article
                    key={item.id}
                    className={`flex items-center gap-2.5 px-3 py-3 ${index ? 'border-t' : ''}`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                        item.type === 'INCOME'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {item.type === 'INCOME' ? '+' : '−'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{item.title}</h3>
                      <p className="truncate text-sm text-muted-foreground">
                        {item.category} · {item.paymentMethod}
                      </p>
                    </div>
                    <p
                      className={`whitespace-nowrap font-bold ${
                        item.type === 'INCOME' ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {item.type === 'INCOME' ? '+' : '−'}
                      {formatRupiah(item.amount)}
                    </p>
                    <DeleteTransactionButton id={item.id} />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
