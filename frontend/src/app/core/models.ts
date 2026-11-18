export type SpotStatus = 'AVAILABLE' | 'OCCUPIED';
export type SessionStatus = 'OPEN' | 'CLOSED';
export type ToastTone = 'success' | 'error' | 'info';
export type UserRole = 'ADMIN' | 'MANAGER' | 'ATTENDANT';

export interface ParkingSpot {
  id: number;
  number: string;
  status: SpotStatus;
  licensePlate: string | null;
  sessionId: number | null;
}

export interface Movement {
  id: number;
  licensePlate: string;
  model: string;
  color: string;
  spotNumber: string;
  entryAt: string;
  exitAt: string | null;
  status: SessionStatus;
  amount: number | null;
  parkingMinutes: number;
}

export interface Dashboard {
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  parkedVehicles: number;
  revenueToday: number;
  occupancyRate: number;
  checkOutsToday: number;
  recentMovements: Movement[];
}

export interface OpenSession {
  id: number;
  licensePlate: string;
  model: string;
  color: string;
  spotNumber: string;
  entryAt: string;
  parkingMinutes: number;
  estimatedAmount: number;
}

export interface CheckOutPreview {
  id: number;
  licensePlate: string;
  model: string;
  color: string;
  spotNumber: string;
  entryAt: string;
  exitAt: string;
  parkingMinutes: number;
  billedMinutes: number;
  amount: number;
}

export interface PricingConfig {
  firstHourRate: number;
  additionalHourRate: number;
  dailyRate: number;
  graceMinutes: number;
  roundingMinutes: number;
  updatedAt: string;
}

export interface CheckInPayload {
  licensePlate: string;
  model: string;
  color: string;
  spotId: number | null;
}

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  user: UserAccount;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name: string;
  role: UserRole;
  active: boolean;
  newPassword: string | null;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fields: Record<string, string> | null;
}
