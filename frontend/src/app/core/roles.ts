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
    return 'bg-asphalt text-white';
  }
  if (role === 'MANAGER') {
    return 'bg-signal text-asphalt';
  }
  return 'border border-line bg-paper text-muted';
}
