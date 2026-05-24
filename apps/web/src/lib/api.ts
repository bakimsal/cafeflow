import type { ApiError, PaginatedResponse } from '@/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─── Token Helpers ────────────────────────────────────────────────────────────

const TOKEN_KEY = 'cf_access_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 → clear token and redirect to login
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const err = data as ApiError;
    throw new Error(err?.message || 'Bir hata oluştu.');
  }

  return data as T;
}

// ─── HTTP Methods ─────────────────────────────────────────────────────────────

export const api = {
  get<T>(endpoint: string, options?: FetchOptions) {
    return apiFetch<T>(endpoint, { method: 'GET', ...options });
  },

  post<T>(endpoint: string, body: unknown, options?: FetchOptions) {
    return apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  },

  put<T>(endpoint: string, body: unknown, options?: FetchOptions) {
    return apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  },

  patch<T>(endpoint: string, body: unknown, options?: FetchOptions) {
    return apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    });
  },

  delete<T>(endpoint: string, options?: FetchOptions) {
    return apiFetch<T>(endpoint, { method: 'DELETE', ...options });
  },
};

// ─── Domain API Calls ─────────────────────────────────────────────────────────

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }, { skipAuth: true }),

  me: () => api.get('/auth/me'),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }, { skipAuth: true }),
};

// Tables
export const tablesApi = {
  getAll: (branchId?: string) =>
    api.get(`/tables${branchId ? `?branchId=${branchId}` : ''}`),

  getById: (id: string) => api.get(`/tables/${id}`),

  create: (data: { branchId: string; name: string }) =>
    api.post('/tables', data),

  update: (id: string, data: Partial<{ name: string; status: string }>) =>
    api.patch(`/tables/${id}`, data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/tables/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/tables/${id}`),
};

// Orders
export const ordersApi = {
  getAll: (params?: { tableId?: string; status?: string; branchId?: string }) =>
    api.get(`/orders?${new URLSearchParams(params as Record<string, string>).toString()}`),

  getById: (id: string) => api.get(`/orders/${id}`),

  create: (data: {
    tableId: string;
    branchId: string;
    source: string;
    note?: string;
    items: { productId: string; quantity: number; note?: string }[];
  }) => api.post('/orders', data),

  addItem: (
    orderId: string,
    item: { productId: string; quantity: number; note?: string },
  ) => api.post(`/orders/${orderId}/items`, item),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),

  cancel: (id: string) => api.patch(`/orders/${id}/cancel`, {}),
};

// Products
export const productsApi = {
  getAll: (params?: { categoryId?: string; isActive?: boolean }) =>
    api.get(
      `/products?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(params ?? {}).map(([k, v]) => [k, String(v)]),
        ),
      ).toString()}`,
    ),

  getById: (id: string) => api.get(`/products/${id}`),

  create: (data: {
    categoryId: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    stock?: number;
  }) => api.post('/products', data),

  update: (id: string, data: Partial<{ name: string; price: number; isActive: boolean }>) =>
    api.patch(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data: { name: string; sortOrder?: number }) =>
    api.post('/categories', data),
  update: (id: string, data: Partial<{ name: string; sortOrder: number; isActive: boolean }>) =>
    api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Payments
export const paymentsApi = {
  create: (data: { orderId: string; amount: number; method: string }) =>
    api.post('/payments', data),

  getByOrder: (orderId: string) => api.get(`/payments?orderId=${orderId}`),

  getAll: (params?: { startDate?: string; endDate?: string; branchId?: string }) =>
    api.get(
      `/payments?${new URLSearchParams(params as Record<string, string>).toString()}`,
    ),
};

// Reports
export const reportsApi = {
  getDailySummary: (date: string, branchId?: string) =>
    api.get(`/reports/daily?date=${date}${branchId ? `&branchId=${branchId}` : ''}`),

  getMonthlySummary: (year: number, month: number, branchId?: string) =>
    api.get(
      `/reports/monthly?year=${year}&month=${month}${branchId ? `&branchId=${branchId}` : ''}`,
    ),

  getTopProducts: (params?: { startDate?: string; endDate?: string; limit?: number }) =>
    api.get(`/reports/top-products?${new URLSearchParams(params as Record<string, string>).toString()}`),
};

// Expenses
export const expensesApi = {
  getAll: (params?: { startDate?: string; endDate?: string; category?: string }) =>
    api.get(
      `/expenses?${new URLSearchParams(params as Record<string, string>).toString()}`,
    ),

  create: (data: {
    branchId: string;
    title: string;
    amount: number;
    category: string;
    description?: string;
  }) => api.post('/expenses', data),
};

export type { PaginatedResponse };
