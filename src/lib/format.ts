/**
 * Format utilities for Dompetku
 */

/**
 * Format number to Indonesian Rupiah currency string
 * Example: 1500000 -> "Rp1.500.000"
 */
export function formatRupiah(amount: number | string): string {
  const num = typeof amount === 'string' ? parseInt(amount, 10) : amount;

  if (isNaN(num)) {
    return 'Rp0';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format date to Indonesian locale
 * Example: new Date('2026-07-28') -> "28 Juli 2026"
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'long'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  if (format === 'short') {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format time to HH:MM format
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format date and time together
 * Example: new Date('2026-07-28T14:30:00') -> "28 Juli 2026 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  return `${formatDate(dateObj, 'long')} ${formatTime(dateObj)}`;
}

/**
 * Get today's date at midnight (for transaction date default)
 */
export function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get relative time string (e.g., "2 hari yang lalu", "Hari ini")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = getTodayMidnight();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(dateObj);
  targetDate.setHours(0, 0, 0, 0);

  const timeDiff = today.getTime() - targetDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    return 'Hari ini';
  } else if (daysDiff === 1) {
    return 'Kemarin';
  } else if (daysDiff < 7) {
    return `${daysDiff} hari yang lalu`;
  } else if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `${weeks} minggu yang lalu`;
  } else if (daysDiff < 365) {
    const months = Math.floor(daysDiff / 30);
    return `${months} bulan yang lalu`;
  }

  return formatDate(dateObj, 'short');
}
