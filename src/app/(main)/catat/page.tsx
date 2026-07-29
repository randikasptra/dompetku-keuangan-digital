import { and, asc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { TransactionForm } from '@/components/forms/TransactionForm';
import { db } from '@/db/client';
import { categories, paymentMethods, users } from '@/db/schema';
import { DEFAULT_CATEGORIES, DEFAULT_PAYMENT_METHODS } from '@/lib/constants';
import { createServerSupabaseClient } from '@/lib/supabase';

function jakartaDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

async function ensureTransactionOptions(user: {
  id: string;
  email?: string;
  user_metadata: Record<string, unknown>;
}) {
  const [profile] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  if (!profile) {
    await db.insert(users).values({
      id: user.id,
      name:
        (typeof user.user_metadata.full_name === 'string' && user.user_metadata.full_name) ||
        user.email?.split('@')[0] ||
        'User',
      email: user.email ?? `${user.id}@supabase.local`,
    });
  }

  const existingCategories = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.userId, user.id))
    .limit(1);

  if (!existingCategories.length) {
    await db.insert(categories).values(
      DEFAULT_CATEGORIES.map((category) => ({ ...category, userId: user.id }))
    );
  }

  const existingMethods = await db
    .select({ id: paymentMethods.id })
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, user.id))
    .limit(1);

  if (!existingMethods.length) {
    await db.insert(paymentMethods).values(
      DEFAULT_PAYMENT_METHODS.map((method) => ({ ...method, userId: user.id }))
    );
  }
}

export default async function CatatPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  await ensureTransactionOptions(user);

  const [categoryOptions, rawPaymentOptions] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        type: categories.type,
        group: categories.group,
      })
      .from(categories)
      .where(and(eq(categories.userId, user.id), eq(categories.isActive, true)))
      .orderBy(asc(categories.name)),
    db
      .select({ id: paymentMethods.id, name: paymentMethods.name })
      .from(paymentMethods)
      .where(and(eq(paymentMethods.userId, user.id), eq(paymentMethods.isActive, true)))
      .orderBy(asc(paymentMethods.name)),
  ]);

  // Data dari onboarding versi lama mungkin berisi metode pembayaran yang sama.
  // Tampilkan satu opsi saja sambil tetap memakai ID yang valid untuk transaksi.
  const paymentOptions = Array.from(
    new Map(rawPaymentOptions.map((method) => [method.name.toLocaleLowerCase('id-ID'), method])).values()
  );

  return (
    <div className="space-y-4 pb-3">
      <div>
        <p className="text-sm font-semibold text-primary">Catat cepat</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Catat Transaksi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hari ini kamu mengeluarkan uang untuk apa?
        </p>
      </div>

      <TransactionForm
        categories={categoryOptions}
        paymentMethods={paymentOptions}
        today={jakartaDate()}
      />
    </div>
  );
}
