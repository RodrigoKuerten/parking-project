import { t, TranslationKey } from './i18n';
import { UserRole } from './models';

export function roleLabel(role: UserRole | null | undefined): string {
  return role ? t(`role.${role}` as TranslationKey) : '—';
}

export function roleBadgeClass(role: UserRole): string {
  if (role === 'ADMIN') {
    return 'border-primary bg-primary text-white';
  }
  if (role === 'MANAGER') {
    return 'border-border bg-accent text-foreground';
  }
  return 'border-border bg-background text-muted';
}
