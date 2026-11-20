import { intlLocale, t } from './i18n';

// Money is always BRL; only digit grouping and date order follow the selected language.
export function formatCurrency(value: number | null | undefined): string {
  return value == null ? '—' : new Intl.NumberFormat(intlLocale(), { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatTime(value: string): string {
  return new Intl.DateTimeFormat(intlLocale(), { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
}

export function formatShortDateTime(value: string): string {
  return new Intl.DateTimeFormat(intlLocale(), {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(value));
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(intlLocale(), { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(value));
}

export function formatLongDate(value: Date): string {
  return new Intl.DateTimeFormat(intlLocale(), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(value);
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;

  if (hours === 0) {
    return t('duration.minutes', { m: remainder });
  }
  return remainder === 0
    ? t('duration.hours', { h: hours })
    : t('duration.hoursMinutes', { h: hours, m: remainder });
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat(intlLocale(), { maximumFractionDigits: 1 }).format(value)}%`;
}

export function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

export function isValidPlate(value: string): boolean {
  return /^[A-Z]{3}\d[A-Z]\d{2}$/.test(value) || /^[A-Z]{3}\d{4}$/.test(value);
}
