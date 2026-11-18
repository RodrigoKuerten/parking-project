const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'BRL'
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

const shortDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric'
});

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

export function formatCurrency(value: number | null | undefined): string {
  return value == null ? '—' : currencyFormatter.format(value);
}

export function formatTime(value: string): string {
  return timeFormatter.format(new Date(value));
}

export function formatShortDateTime(value: string): string {
  return shortDateTimeFormatter.format(new Date(value));
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatLongDate(value: Date): string {
  return longDateFormatter.format(value);
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;

  if (hours === 0) {
    return `${remainder}m`;
  }
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)}%`;
}

export function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

export function isValidPlate(value: string): boolean {
  return /^[A-Z]{3}\d[A-Z]\d{2}$/.test(value) || /^[A-Z]{3}\d{4}$/.test(value);
}
