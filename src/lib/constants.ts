/**
 * Constants for Dompetku - Categories, Payment Methods, and other static data
 */

export interface CategoryData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  group?: 'NEEDS' | 'WANTS' | null;
  icon: string;
}

export interface PaymentMethodData {
  name: string;
  type: 'CASH' | 'BANK' | 'EWALLET' | 'OTHER';
  icon: string;
}

/**
 * Default categories for all users
 * These will be inserted during onboarding
 */
export const DEFAULT_CATEGORIES: CategoryData[] = [
  // INCOME Categories
  { name: 'Gaji', type: 'INCOME', icon: 'briefcase', group: null },
  { name: 'Freelance', type: 'INCOME', icon: 'code', group: null },
  { name: 'Investasi', type: 'INCOME', icon: 'trending-up', group: null },
  { name: 'Bonus', type: 'INCOME', icon: 'gift', group: null },
  { name: 'Lainnya', type: 'INCOME', icon: 'plus-circle', group: null },

  // EXPENSE - NEEDS (Kebutuhan Pokok)
  { name: 'Makan & Minum', type: 'EXPENSE', icon: 'utensils', group: 'NEEDS' },
  { name: 'Transportasi', type: 'EXPENSE', icon: 'car', group: 'NEEDS' },
  { name: 'Tagihan', type: 'EXPENSE', icon: 'receipt', group: 'NEEDS' },
  { name: 'Kesehatan', type: 'EXPENSE', icon: 'heart', group: 'NEEDS' },
  { name: 'Pendidikan', type: 'EXPENSE', icon: 'book', group: 'NEEDS' },
  { name: 'Kebutuhan Rumah', type: 'EXPENSE', icon: 'home', group: 'NEEDS' },
  { name: 'Kerja', type: 'EXPENSE', icon: 'briefcase', group: 'NEEDS' },
  { name: 'Cicilan Wajib', type: 'EXPENSE', icon: 'credit-card', group: 'NEEDS' },

  // EXPENSE - WANTS (Keinginan)
  { name: 'Nongkrong', type: 'EXPENSE', icon: 'coffee', group: 'WANTS' },
  { name: 'Hiburan', type: 'EXPENSE', icon: 'music', group: 'WANTS' },
  { name: 'Fashion', type: 'EXPENSE', icon: 'shopping-bag', group: 'WANTS' },
  { name: 'Aksesoris', type: 'EXPENSE', icon: 'watch', group: 'WANTS' },
  { name: 'Gadget', type: 'EXPENSE', icon: 'smartphone', group: 'WANTS' },
  { name: 'Pasangan/Apel', type: 'EXPENSE', icon: 'heart', group: 'WANTS' },
  { name: 'Game', type: 'EXPENSE', icon: 'gamepad-2', group: 'WANTS' },
  { name: 'Liburan', type: 'EXPENSE', icon: 'plane', group: 'WANTS' },
  { name: 'Kado', type: 'EXPENSE', icon: 'gift', group: 'WANTS' },
];

/**
 * Default payment methods
 * These will be inserted during onboarding based on user selection
 */
export const DEFAULT_PAYMENT_METHODS: PaymentMethodData[] = [
  { name: 'Tunai', type: 'CASH', icon: 'wallet' },
  { name: 'Bank', type: 'BANK', icon: 'building' },
  { name: 'QRIS', type: 'EWALLET', icon: 'qrcode' },
  { name: 'DANA', type: 'EWALLET', icon: 'smartphone' },
  { name: 'GoPay', type: 'EWALLET', icon: 'smartphone' },
  { name: 'OVO', type: 'EWALLET', icon: 'smartphone' },
  { name: 'ShopeePay', type: 'EWALLET', icon: 'smartphone' },
];

/**
 * Quick categories for the Catat (transaction entry) page
 * These appear as chips for quick selection
 */
export const QUICK_CATEGORIES = [
  'Makan',
  'Bensin',
  'Nongkrong',
  'Apel',
  'Belanja',
];

/**
 * Frequency options for routine income
 */
export const FREQUENCY_OPTIONS = [
  { value: 'WEEKLY', label: 'Mingguan' },
  { value: 'MONTHLY', label: 'Bulanan' },
];

/**
 * Month names in Indonesian for reports
 */
export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Transaction type labels
 */
export const TRANSACTION_TYPE_LABELS: Record<'INCOME' | 'EXPENSE', string> = {
  INCOME: 'Pemasukan',
  EXPENSE: 'Pengeluaran',
};

/**
 * Category group labels
 */
export const CATEGORY_GROUP_LABELS: Record<'NEEDS' | 'WANTS', string> = {
  NEEDS: 'Kebutuhan Pokok',
  WANTS: 'Keinginan',
};

/**
 * Payment method type labels
 */
export const PAYMENT_METHOD_TYPE_LABELS: Record<'CASH' | 'BANK' | 'EWALLET' | 'OTHER', string> = {
  CASH: 'Tunai',
  BANK: 'Bank',
  EWALLET: 'E-Wallet',
  OTHER: 'Lainnya',
};
