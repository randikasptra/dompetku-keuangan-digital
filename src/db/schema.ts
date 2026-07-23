import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const typeEnum = pgEnum('transaction_type', ['INCOME', 'EXPENSE']);
export const groupEnum = pgEnum('category_group', ['NEEDS', 'WANTS']);
export const paymentMethodTypeEnum = pgEnum('payment_method_type', ['CASH', 'BANK', 'EWALLET', 'OTHER']);
export const frequencyEnum = pgEnum('routine_frequency', ['MONTHLY', 'WEEKLY']);

// 1. Users Table
// Note: id references Supabase's auth.users id
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  currency: text('currency').default('IDR').notNull(),
  timezone: text('timezone').default('Asia/Jakarta').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable for system default categories
  type: typeEnum('type').notNull(),
  group: groupEnum('group'), // Nullable for income type
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// 3. Payment Methods Table
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable for system default payment methods
  name: text('name').notNull(),
  type: paymentMethodTypeEnum('type').notNull(),
  icon: text('icon').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// 4. Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  amount: integer('amount').notNull(), // Rupiah has no cents, using integer to avoid precision issues
  type: typeEnum('type').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }).notNull(),
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id, { onDelete: 'restrict' }).notNull(),
  date: timestamp('date').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Routine Income Table (Pemasukan Rutin)
export const routineIncomes = pgTable('routine_incomes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  amount: integer('amount').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }).notNull(),
  frequency: frequencyEnum('frequency').notNull(),
  receiveDate: integer('receive_date').notNull(), // e.g., 25 for every 25th of the month
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true).notNull(),
});
