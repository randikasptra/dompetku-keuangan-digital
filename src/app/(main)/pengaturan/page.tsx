import { and, count, eq } from 'drizzle-orm';
import { FolderCog, LogOut, Mail, UserRound, WalletCards } from 'lucide-react';
import { redirect } from 'next/navigation';

import { signOutAction } from '@/app/actions/auth';
import { SettingsForm } from '@/components/forms/SettingsForm';
import { Button } from '@/components/ui/button';
import { db } from '@/db/client';
import { categories, paymentMethods, transactions, users } from '@/db/schema';
import { createServerSupabaseClient } from '@/lib/supabase';

export default async function PengaturanPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profile] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!profile) redirect('/catat');

  const [[transactionCount], [categoryCount], [methodCount]] = await Promise.all([
    db.select({ value: count() }).from(transactions).where(eq(transactions.userId, user.id)),
    db
      .select({ value: count() })
      .from(categories)
      .where(and(eq(categories.userId, user.id), eq(categories.isActive, true))),
    db
      .select({ value: count() })
      .from(paymentMethods)
      .where(and(eq(paymentMethods.userId, user.id), eq(paymentMethods.isActive, true))),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-primary">Akun dan preferensi</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola identitas dan preferensi Dompetku</p>
      </div>

      <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">{profile.name}</h2>
            <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
          </div>
        </div>
        <SettingsForm
          name={profile.name}
          currency={profile.currency}
          timezone={profile.timezone}
        />
      </section>

      <section className="grid grid-cols-3 gap-2">
        <article className="rounded-xl border bg-card p-3">
          <WalletCards className="h-5 w-5 text-primary" />
          <p className="mt-2 text-xl font-bold">{transactionCount.value}</p>
          <p className="text-xs text-muted-foreground">Transaksi</p>
        </article>
        <article className="rounded-xl border bg-card p-3">
          <FolderCog className="h-5 w-5 text-primary" />
          <p className="mt-2 text-xl font-bold">{categoryCount.value}</p>
          <p className="text-xs text-muted-foreground">Kategori</p>
        </article>
        <article className="rounded-xl border bg-card p-3">
          <WalletCards className="h-5 w-5 text-primary" />
          <p className="mt-2 text-xl font-bold">{methodCount.value}</p>
          <p className="text-xs text-muted-foreground">Pembayaran</p>
        </article>
      </section>

      <section className="rounded-xl border border-red-200 bg-card p-4">
        <h2 className="font-bold">Sesi akun</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keluar dengan aman dari perangkat ini.
        </p>
        <form action={signOutAction} className="mt-4">
          <Button type="submit" variant="outline" className="text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </form>
      </section>
    </div>
  );
}
