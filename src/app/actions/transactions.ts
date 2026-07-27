'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from '@/db/client';
import { categories, paymentMethods, transactions } from '@/db/schema';
import { createServerSupabaseClient } from '@/lib/supabase';

const transactionSchema = z.object({
  title: z.string().trim().min(2, 'Nama transaksi minimal 2 karakter').max(100),
  amount: z.coerce.number().int().positive('Nominal harus lebih dari Rp0').max(2_147_483_647),
  type: z.enum(['INCOME', 'EXPENSE']),
  group: z.enum(['NEEDS', 'WANTS']).optional(),
  categoryId: z.string().uuid('Kategori tidak valid'),
  paymentMethodId: z.string().uuid('Metode pembayaran tidak valid'),
  date: z.string().date('Tanggal tidak valid'),
  note: z.string().trim().max(500, 'Catatan maksimal 500 karakter').optional(),
});

export type TransactionActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  transaction?: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    paymentMethod: string;
    date: string;
  };
};

export async function createTransactionAction(
  _previousState: TransactionActionState,
  formData: FormData
): Promise<TransactionActionState> {
  const parsed = transactionSchema.safeParse({
    title: formData.get('title'),
    amount: formData.get('amount'),
    type: formData.get('type'),
    group: formData.get('group') || undefined,
    categoryId: formData.get('categoryId'),
    paymentMethodId: formData.get('paymentMethodId'),
    date: formData.get('date'),
    note: formData.get('note') || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Periksa kembali data transaksi.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Sesi berakhir. Silakan masuk kembali.' };
  }

  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, parsed.data.categoryId), eq(categories.userId, user.id)))
    .limit(1);

  if (!category || category.type !== parsed.data.type) {
    return { success: false, message: 'Kategori tidak tersedia untuk jenis transaksi ini.' };
  }

  if (
    parsed.data.type === 'EXPENSE' &&
    (!parsed.data.group || category.group !== parsed.data.group)
  ) {
    return { success: false, message: 'Kelompok dan kategori pengeluaran tidak sesuai.' };
  }

  const [paymentMethod] = await db
    .select()
    .from(paymentMethods)
    .where(
      and(
        eq(paymentMethods.id, parsed.data.paymentMethodId),
        eq(paymentMethods.userId, user.id)
      )
    )
    .limit(1);

  if (!paymentMethod) {
    return { success: false, message: 'Metode pembayaran tidak tersedia.' };
  }

  await db.insert(transactions).values({
    userId: user.id,
    title: parsed.data.title,
    amount: parsed.data.amount,
    type: parsed.data.type,
    categoryId: category.id,
    paymentMethodId: paymentMethod.id,
    date: new Date(`${parsed.data.date}T12:00:00+07:00`),
    note: parsed.data.note || null,
  });

  revalidatePath('/riwayat');
  revalidatePath('/laporan');

  return {
    success: true,
    message: 'Transaksi berhasil disimpan.',
    transaction: {
      title: parsed.data.title,
      amount: parsed.data.amount,
      type: parsed.data.type,
      category: category.name,
      paymentMethod: paymentMethod.name,
      date: parsed.data.date,
    },
  };
}

export async function deleteTransactionAction(transactionId: string) {
  const parsedId = z.string().uuid().safeParse(transactionId);
  if (!parsedId.success) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await db
    .delete(transactions)
    .where(and(eq(transactions.id, parsedId.data), eq(transactions.userId, user.id)));

  revalidatePath('/riwayat');
  revalidatePath('/laporan');
}
