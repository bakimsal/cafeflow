// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'OWNER' | 'MANAGER' | 'CASHIER';

export type TableStatus =
  | 'EMPTY'
  | 'OCCUPIED'
  | 'WAITING_ORDER'
  | 'ASKING_BILL'
  | 'CLOSED';

export type OrderStatus =
  | 'OPEN'
  | 'PENDING_APPROVAL'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'PAID';

export type OrderSource = 'CASHIER' | 'QR_MENU';

export type PaymentMethod =
  | 'CASH'
  | 'CARD'
  | 'MEAL_CARD'
  | 'TRANSFER'
  | 'MIXED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type ExpenseCategory =
  | 'FOOD_SUPPLY'
  | 'RENT'
  | 'ELECTRICITY'
  | 'WATER'
  | 'STAFF'
  | 'OTHER';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId: string;
  branchId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  businessId: string;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  branchId: string;
  name: string;
  qrCode: string | null;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
  // relations
  activeOrder?: Order | null;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  stock: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // relations
  category?: Category;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note: string | null;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  // relations
  product?: Product;
}

export interface Order {
  id: string;
  tableId: string;
  branchId: string;
  status: OrderStatus;
  totalAmount: number;
  source: OrderSource;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  // relations
  items?: OrderItem[];
  table?: Table;
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface Expense {
  id: string;
  branchId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  description: string | null;
  createdAt: string;
  // relations
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
