import { api, getToken, setToken, removeToken } from './api';
import type { AuthResponse, User } from '@/types';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const USER_KEY = 'cf_user';

// ─── User Session Helpers ─────────────────────────────────────────────────────

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  removeToken();
  localStorage.removeItem(USER_KEY);
}

// ─── Auth Actions ─────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>(
    '/auth/login',
    { email, password },
    { skipAuth: true },
  );

  setToken(data.accessToken);
  setStoredUser(data.user);

  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', {});
  } catch {
    // Ignore errors on logout
  } finally {
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const user = await api.get<User>('/auth/me');
  setStoredUser(user);
  return user;
}

// ─── Auth Guards ──────────────────────────────────────────────────────────────

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(
  user: User | null,
  roles: User['role'][],
): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

export function isAdmin(user: User | null): boolean {
  return hasRole(user, ['SUPER_ADMIN', 'OWNER', 'MANAGER']);
}

export function isCashier(user: User | null): boolean {
  return hasRole(user, ['CASHIER', 'MANAGER', 'OWNER', 'SUPER_ADMIN']);
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { getToken, setToken, removeToken };
