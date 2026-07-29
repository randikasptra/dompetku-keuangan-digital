'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import { db } from '@/db/client';
import { users, categories, paymentMethods, routineIncomes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_CATEGORIES, DEFAULT_PAYMENT_METHODS } from '@/lib/constants';

export interface OnboardingData {
  // Step 1: Routine income (optional)
  routineIncomeName?: string;
  routineIncomeAmount?: number;
  routineIncomeReceiveDate?: number;
  hasRoutineIncome?: boolean;

  // Step 2: Selected payment method types
  selectedPaymentMethods?: string[];
}

// Server Action: Create user profile and initial setup
export async function completeOnboardingAction(data: OnboardingData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Check if user profile already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  // Create user profile if not exists
  if (!existingUser.length) {
    await db.insert(users).values({
      id: user.id,
      name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
      email: user.email!,
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
    });
  }

  // Insert default categories for this user (seeded from system-level categories)
  const existingCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, user.id))
    .limit(1);

  if (!existingCategories.length) {
    const userCategories = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      userId: user.id,
      id: undefined,
    }));
    await db.insert(categories).values(userCategories as typeof categories.$inferInsert[]);
  }

  // Insert selected payment methods for this user
  const selectedMethods = data.selectedPaymentMethods ?? ['CASH'];
  const methodsToInsert = DEFAULT_PAYMENT_METHODS.filter((m) =>
    selectedMethods.includes(m.name) || selectedMethods.includes(m.type)
  );

  const existingMethods = await db
    .select({ name: paymentMethods.name })
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, user.id));
  const existingMethodNames = new Set(
    existingMethods.map((method) => method.name.toLocaleLowerCase('id-ID'))
  );
  const newMethods = methodsToInsert.filter(
    (method) => !existingMethodNames.has(method.name.toLocaleLowerCase('id-ID'))
  );

  if (newMethods.length > 0) {
    await db.insert(paymentMethods).values(
      newMethods.map((m) => ({
        ...m,
        userId: user.id,
        id: undefined,
      })) as typeof paymentMethods.$inferInsert[]
    );
  }

  // Insert routine income if provided
  if (data.hasRoutineIncome && data.routineIncomeAmount && data.routineIncomeReceiveDate) {
    // Get income category (first income category)
    const incomeCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, user.id))
      .limit(1);

    if (incomeCategory.length > 0) {
      await db.insert(routineIncomes).values({
        userId: user.id,
        name: data.routineIncomeName || 'Gaji',
        amount: data.routineIncomeAmount,
        categoryId: incomeCategory[0].id,
        frequency: 'MONTHLY',
        receiveDate: data.routineIncomeReceiveDate,
        startDate: new Date(),
        isActive: true,
      });
    }
  }

  redirect('/catat');
}

// Server Action: Check if user has completed onboarding
export async function checkOnboardingStatus(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  return existingUser.length > 0;
}
