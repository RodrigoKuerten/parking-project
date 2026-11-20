import { UserRole } from './models';

const labels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  ATTENDANT: 'Attendant'
};

export function roleLabel(role: UserRole | null | undefined): string {
  return role ? labels[role] : '—';
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
