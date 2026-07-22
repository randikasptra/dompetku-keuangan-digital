/**
 * Type definitions for Dompetku
 */

// Database Models
export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  timezone: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  userId: string | null;
  type: 'INCOME' | 'EXPENSE';
  group: 'NEEDS' | 'WANTS' | null;
  name: string;
  icon: string;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  userId: string | null;
  name: string;
  type: 'CASH' | 'BANK' | 'EWALLET' | 'OTHER';
  icon: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  paymentMethodId: string;
  date: Date;
  note: string | null;
  createdAt: Date;
}

export interface RoutineIncome {
  id: string;
  userId: string;
  name: string;
  amount: number;
  categoryId: string;
  frequency: 'MONTHLY' | 'WEEKLY';
  receiveDate: number;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export interface TransactionFormData {
  title: string;
  amount: string; // String because of number formatting
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  paymentMethodId: string;
  date: Date;
  note?: string;
}

export interface OnboardingFormData {
  // Step 1
  routineIncomeName?: string;
  routineIncomeAmount?: string;
  routineIncomeReceiveDate?: number;
  hasRoutineIncome?: boolean;

  // Step 2
  selectedPaymentMethods?: string[];

  // Step 3
  acknowledgedEducation?: boolean;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
}

export interface DailySummary {
  date: Date;
  totalIncome: number;
  totalExpense: number;
  totalNeeds: number;
  totalWants: number;
  transactions: Transaction[];
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  totalNeeds: number;
  totalWants: number;
  byCategory: CategoryExpense[];
  dailyData: DailySummary[];
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}
