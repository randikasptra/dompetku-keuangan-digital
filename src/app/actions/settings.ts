'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from '@/db/client';
import { users } from '@/db/schema';
import { createServerSupabaseClient } from '@/lib/supabase';

export type SettingsActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const settingsSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(80),
  currency: z.enum(['IDR']),
  timezone: z.enum(['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura']),
});

export async function updateSettingsAction(
  _previousState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const parsed = settingsSchema.safeParse({
    name: formData.get('name'),
    currency: formData.get('currency'),
    timezone: formData.get('timezone'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Periksa kembali data profil.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Sesi berakhir. Silakan masuk kembali.' };

  await db
    .update(users)
    .set({
      name: parsed.data.name,
      currency: parsed.data.currency,
      timezone: parsed.data.timezone,
    })
    .where(eq(users.id, user.id));

  await supabase.auth.updateUser({ data: { full_name: parsed.data.name } });
  revalidatePath('/pengaturan');

  return { success: true, message: 'Pengaturan berhasil disimpan.' };
}
