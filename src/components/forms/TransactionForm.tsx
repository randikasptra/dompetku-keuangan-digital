'use client';

import { useActionState, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, Plus, WalletCards } from 'lucide-react';

import {
  createTransactionAction,
  type TransactionActionState,
} from '@/app/actions/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type CategoryOption = {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  group: 'NEEDS' | 'WANTS' | null;
};

type PaymentOption = {
  id: string;
  name: string;
};

type TransactionFormProps = {
  categories: CategoryOption[];
  paymentMethods: PaymentOption[];
  today: string;
};

const quickCategories = [
  { label: 'Makan', category: 'Makan & Minum', title: 'Makan' },
  { label: 'Bensin', category: 'Transportasi', title: 'Bensin' },
  { label: 'Nongkrong', category: 'Nongkrong', title: 'Nongkrong' },
  { label: 'Apel', category: 'Pasangan/Apel', title: 'Apel' },
  { label: 'Belanja', category: 'Fashion', title: 'Belanja' },
];

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const initialTransactionState: TransactionActionState = {
  success: false,
};

export function TransactionForm({
  categories,
  paymentMethods,
  today,
}: TransactionFormProps) {
  const [state, formAction, pending] = useActionState(
    createTransactionAction,
    initialTransactionState
  );
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [group, setGroup] = useState<'NEEDS' | 'WANTS'>('NEEDS');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const availableCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.type === type && (type === 'INCOME' || category.group === group)
      ),
    [categories, group, type]
  );

  // Pengaman di sisi browser untuk data lama yang mungkin tersimpan ganda.
  const uniquePaymentMethods = useMemo(
    () =>
      Array.from(
        new Map(
          paymentMethods.map((method) => [method.name.trim().toLocaleLowerCase('id-ID'), method])
        ).values()
      ),
    [paymentMethods]
  );

  function selectType(nextType: 'INCOME' | 'EXPENSE') {
    setType(nextType);
    setCategoryId('');
  }

  function selectGroup(nextGroup: 'NEEDS' | 'WANTS') {
    setGroup(nextGroup);
    setCategoryId('');
  }

  function selectQuickCategory(categoryName: string, nextTitle: string) {
    const category = categories.find(
      (item) => item.type === 'EXPENSE' && item.name === categoryName
    );

    if (!category) return;
    setType('EXPENSE');
    setGroup(category.group === 'WANTS' ? 'WANTS' : 'NEEDS');
    setCategoryId(category.id);
    setTitle(nextTitle);
  }

  function formatAmount(value: string) {
    const digits = value.replace(/\D/g, '').replace(/^0+/, '');
    setAmount(digits ? new Intl.NumberFormat('id-ID').format(Number(digits)) : '');
  }

  function resetForm() {
    window.location.reload();
  }

  if (state.success && state.transaction) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-card p-4 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-bold">Transaksi berhasil disimpan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Catatan keuanganmu sudah masuk ke Dompetku.
          </p>
        </div>

        <dl className="mt-6 divide-y rounded-xl bg-muted/60 px-4">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">Transaksi</dt>
            <dd className="text-right text-sm font-semibold">{state.transaction.title}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">Nominal</dt>
            <dd
              className={cn(
                'text-right text-sm font-bold',
                state.transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-emerald-700'
              )}
            >
              {state.transaction.type === 'EXPENSE' ? '-' : '+'}
              {rupiah.format(state.transaction.amount)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">Kategori</dt>
            <dd className="text-right text-sm font-medium">{state.transaction.category}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">Pembayaran</dt>
            <dd className="text-right text-sm font-medium">
              {state.transaction.paymentMethod}
            </dd>
          </div>
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="button" size="lg" onClick={resetForm}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Lagi
          </Button>
          <Link
            href="/riwayat"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-base font-medium transition-colors hover:bg-accent"
          >
            Lihat Riwayat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="group" value={type === 'EXPENSE' ? group : ''} />
      <input type="hidden" name="amount" value={amount.replace(/\D/g, '')} />

      <div
        className="grid grid-cols-2 rounded-xl bg-muted p-1"
        role="group"
        aria-label="Jenis transaksi"
      >
        {(['EXPENSE', 'INCOME'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => selectType(item)}
            className={cn(
              'min-h-11 rounded-lg px-4 text-sm font-semibold transition',
              type === item
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}
          </button>
        ))}
      </div>

      {type === 'EXPENSE' && (
        <div>
          <p className="mb-3 text-sm font-medium">Pilih cepat</p>
          <div className="flex flex-wrap gap-2">
            {quickCategories.map((quick) => (
              <button
                key={quick.label}
                type="button"
                onClick={() => selectQuickCategory(quick.category, quick.title)}
                className="brand-gradient-hover min-h-11 rounded-full border border-purple-100 bg-purple-50 px-4 text-sm font-medium text-purple-800 transition hover:border-primary hover:text-primary-foreground"
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              {type === 'EXPENSE' ? 'Beli atau bayar apa?' : 'Pemasukan dari mana?'}
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={type === 'EXPENSE' ? 'Contoh: makan siang' : 'Contoh: gaji bulanan'}
              error={Boolean(state.errors?.title)}
              required
            />
            {state.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount-display">Nominal</Label>
            <div className="flex items-center rounded-xl border bg-background px-4 focus-within:ring-2 focus-within:ring-ring">
              <span className="text-xl font-semibold text-muted-foreground">Rp</span>
              <input
                id="amount-display"
                inputMode="numeric"
                value={amount}
                onChange={(event) => formatAmount(event.target.value)}
                placeholder="0"
                className="h-14 w-full bg-transparent px-3 text-2xl font-bold outline-none placeholder:text-muted-foreground/50"
                aria-describedby={state.errors?.amount ? 'amount-error' : undefined}
                required
              />
            </div>
            {state.errors?.amount && (
              <p id="amount-error" className="text-sm text-destructive">
                {state.errors.amount[0]}
              </p>
            )}
          </div>

          {type === 'EXPENSE' && (
            <fieldset>
              <legend className="mb-3 text-sm font-medium">Kelompok</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['NEEDS', 'WANTS'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectGroup(item)}
                    className={cn(
                      'min-h-12 rounded-xl border px-3 text-left text-sm font-semibold transition',
                      group === item
                        ? 'border-primary brand-tint text-primary ring-1 ring-primary'
                        : 'hover:border-primary/50'
                    )}
                  >
                    {item === 'NEEDS' ? 'Kebutuhan Pokok' : 'Keinginan'}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="space-y-2">
            <Label htmlFor="categoryId">Kategori</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Pilih kategori</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {state.errors?.categoryId && (
              <p className="text-sm text-destructive">{state.errors.categoryId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethodId">Metode pembayaran</Label>
            <select
              id="paymentMethodId"
              name="paymentMethodId"
              defaultValue={uniquePaymentMethods[0]?.id ?? ''}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {uniquePaymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" name="date" type="date" defaultValue={today} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Catatan (opsional)</Label>
              <Input id="note" name="note" placeholder="Tambahkan catatan" maxLength={500} />
            </div>
          </div>
        </div>
      </div>

      {state.message && !state.success && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      )}

      <div className="sticky bottom-20 rounded-2xl bg-background/95 py-2 backdrop-blur md:bottom-0">
        <Button
          type="submit"
          size="lg"
          disabled={pending || !uniquePaymentMethods.length}
          className="h-12 w-full rounded-xl text-sm font-bold"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <WalletCards className="mr-2 h-5 w-5" />
              Simpan Transaksi
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
