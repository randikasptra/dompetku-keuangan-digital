'use client';

import { useState } from 'react';
import Image from 'next/image';
import { completeOnboardingAction, type OnboardingData } from '@/app/actions/onboarding';
import { Shield, Heart, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_PAYMENT_METHODS } from '@/lib/constants';

const PAYMENT_METHOD_NAMES = DEFAULT_PAYMENT_METHODS.map((m) => m.name);

interface OnboardingFormState {
  // Step 1
  routineIncomeName: string;
  routineIncomeAmount: string;
  routineIncomeReceiveDate: string;
  autoRecord: boolean;
  hasRoutineIncome: boolean;

  // Step 2
  selectedPaymentMethods: string[];
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            step === currentStep
              ? 'bg-primary scale-110'
              : step < currentStep
                ? 'bg-primary/50'
                : 'bg-gray-300 dark:bg-gray-600'
          )}
        />
      ))}
    </div>
  );
}

function Step1({
  formData,
  onUpdate,
  onNext,
  onSkip,
}: {
  formData: OnboardingFormState;
  onUpdate: (data: Partial<OnboardingFormState>) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Berapa pemasukan rutinmu?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Atur pemasukan bulananmu agar pencatatan lebih mudah
        </p>
      </div>

      <div className="space-y-4">
        {/* Nama Pemasukan */}
        <div>
          <label htmlFor="incomeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama pemasukan
          </label>
          <input
            id="incomeName"
            type="text"
            value={formData.routineIncomeName}
            onChange={(e) => onUpdate({ routineIncomeName: e.target.value })}
            placeholder="Gaji"
            className={cn(
              'w-full px-4 py-3 border rounded-xl',
              'bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:ring-2 focus:ring-primary focus:border-primary',
              'transition-all duration-200'
            )}
          />
        </div>

        {/* Nominal */}
        <div>
          <label htmlFor="incomeAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nominal
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium">
              Rp
            </span>
            <input
              id="incomeAmount"
              type="number"
              value={formData.routineIncomeAmount}
              onChange={(e) => onUpdate({ routineIncomeAmount: e.target.value })}
              placeholder="5000000"
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-xl',
                'bg-white dark:bg-gray-800',
                'border-gray-300 dark:border-gray-700',
                'text-gray-900 dark:text-white',
                'placeholder-gray-500 dark:placeholder-gray-400',
                'focus:ring-2 focus:ring-primary focus:border-primary',
                'transition-all duration-200'
              )}
            />
          </div>
        </div>

        {/* Tanggal Terima */}
        <div>
          <label htmlFor="receiveDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tanggal terima
          </label>
          <input
            id="receiveDate"
            type="number"
            min={1}
            max={31}
            value={formData.routineIncomeReceiveDate}
            onChange={(e) => onUpdate({ routineIncomeReceiveDate: e.target.value })}
            placeholder="25"
            className={cn(
              'w-full px-4 py-3 border rounded-xl',
              'bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:ring-2 focus:ring-primary focus:border-primary',
              'transition-all duration-200'
            )}
          />
        </div>

        {/* Auto Record Checkbox */}
        <div className="flex items-center">
          <input
            id="autoRecord"
            type="checkbox"
            checked={formData.autoRecord}
            onChange={(e) => onUpdate({ autoRecord: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
          />
          <label htmlFor="autoRecord" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            Catat otomatis setiap bulan
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onNext}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-medium text-white',
            'brand-gradient brand-gradient-hover shadow-sm shadow-violet-500/20',
            'transition-colors duration-200',
            'flex items-center justify-center gap-2'
          )}
        >
          Lanjut
          <ArrowRight size={18} />
        </button>
        <button
          onClick={onSkip}
          className="w-full py-3 px-4 rounded-xl font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
        >
          Lewati dulu
        </button>
      </div>
    </div>
  );
}

function Step2({
  formData,
  onUpdate,
  onNext,
  onBack,
}: {
  formData: OnboardingFormState;
  onUpdate: (data: Partial<OnboardingFormState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggleMethod = (method: string) => {
    const current = formData.selectedPaymentMethods;
    if (current.includes(method)) {
      onUpdate({ selectedPaymentMethods: current.filter((m) => m !== method) });
    } else {
      onUpdate({ selectedPaymentMethods: [...current, method] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Metode pembayaran yang sering kamu pakai?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pilih satu atau lebih metode pembayaran
        </p>
      </div>

      {/* Payment Method Chips */}
      <div className="flex flex-wrap gap-3">
        {PAYMENT_METHOD_NAMES.map((method) => {
          const isSelected = formData.selectedPaymentMethods.includes(method);
          return (
            <button
              key={method}
              onClick={() => toggleMethod(method)}
              className={cn(
                'px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200',
                isSelected
                  ? 'border-2 border-primary bg-purple-50 text-primary'
                  : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {isSelected && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
              {method}
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onNext}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-medium text-white',
            'brand-gradient brand-gradient-hover shadow-sm shadow-violet-500/20',
            'transition-colors duration-200',
            'flex items-center justify-center gap-2'
          )}
        >
          Lanjut
          <ArrowRight size={18} />
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 px-4 rounded-xl font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>
      </div>
    </div>
  );
}

function Step3({
  onComplete,
  onBack,
  isLoading,
}: {
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Tips mengelola keuangan
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pahami perbedaan kebutuhan dan keinginan
        </p>
      </div>

      {/* Info Cards */}
      <div className="space-y-4">
        {/* Kebutuhan Pokok */}
        <div className="flex items-start gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
            <Shield size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Kebutuhan Pokok</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pengeluaran wajib seperti makan, transportasi, tagihan
            </p>
          </div>
        </div>

        {/* Keinginan */}
        <div className="flex items-start gap-4 p-5 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 dark:border-pink-800">
          <div className="flex-shrink-0 p-2 bg-pink-100 dark:bg-pink-900/40 rounded-xl">
            <Heart size={24} className="text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Keinginan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pengeluaran non-esensial seperti nongkrong, hiburan, fashion
            </p>
          </div>
        </div>
      </div>

      {/* Explanation Text */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
        Dompetku membantu kamu memisahkan kebutuhan dari keinginan agar keuanganmu lebih teratur.
      </p>

      {/* Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onComplete}
          disabled={isLoading}
          className={cn(
            'w-full py-4 px-4 rounded-xl font-semibold text-white text-lg',
            'brand-gradient brand-gradient-hover shadow-sm shadow-violet-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading ? 'Menyiapkan akun...' : 'Mulai Mencatat'}
        </button>
        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingFormState>({
    routineIncomeName: 'Gaji',
    routineIncomeAmount: '',
    routineIncomeReceiveDate: '',
    autoRecord: true,
    hasRoutineIncome: true,
    selectedPaymentMethods: ['Tunai'],
  });

  const updateFormData = (data: Partial<OnboardingFormState>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleStep1Next = () => {
    setFormData((prev) => ({ ...prev, hasRoutineIncome: true }));
    setCurrentStep(2);
  };

  const handleStep1Skip = () => {
    setFormData((prev) => ({ ...prev, hasRoutineIncome: false }));
    setCurrentStep(2);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const onboardingData: OnboardingData = {
        hasRoutineIncome: formData.hasRoutineIncome,
        selectedPaymentMethods: formData.selectedPaymentMethods,
      };

      if (formData.hasRoutineIncome) {
        onboardingData.routineIncomeName = formData.routineIncomeName || 'Gaji';
        onboardingData.routineIncomeAmount = formData.routineIncomeAmount
          ? Number(formData.routineIncomeAmount)
          : undefined;
        onboardingData.routineIncomeReceiveDate = formData.routineIncomeReceiveDate
          ? Number(formData.routineIncomeReceiveDate)
          : undefined;
      }

      // completeOnboardingAction redirects on success
      await completeOnboardingAction(onboardingData);
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-4">
          <Image
            src="/img/logo2.png"
            alt="Dompetku"
            width={310}
            height={91}
            className="mx-auto h-auto w-48"
            priority
          />
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Steps */}
          {currentStep === 1 && (
            <Step1
              formData={formData}
              onUpdate={updateFormData}
              onNext={handleStep1Next}
              onSkip={handleStep1Skip}
            />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              onUpdate={updateFormData}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <Step3
              onComplete={handleComplete}
              onBack={() => setCurrentStep(2)}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
