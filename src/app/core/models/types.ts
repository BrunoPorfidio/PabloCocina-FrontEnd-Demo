
// --- ORDER STATUS CONSTANTS ---
export const ORDER_STATUS = {
  TO_PRINT: 'TO_PRINT',
  PRINTED: 'PRINTED',
  CANCELLED: 'CANCELLED',
  DELIVERED: 'DELIVERED',
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// --- ERROR CODES (coincide con ErrorCodes.java) ---
export interface ApiError {
  code: string;       // e.g. "PC0006"
  description: string; // e.g. "Credenciales incorrectas"
}

// Wrapper genérico de respuesta del Backend
export interface ApiResponse<T> {
  timeStamp?: string;
  timestamp?: string; // Backend a veces usa minúscula
  statusCode?: number;
  status?: string;
  message?: string;
  errors?: ApiError[];
  data: T; 
}

// --- ORDER DETAILS (ticket template) ---
export interface OrderDetails {
  customerName: string;
  phone?: string;
  deliveryType: string;
  address?: string;
  paymentMethod: string;
  notes?: string;
}

// --- PAGINACIÓN (Spring Boot) ---
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Índice base 0
  first: boolean;
  last: boolean;
  empty: boolean;
}

// --- AUTH DTOs ---

export interface DecodedToken {
  sub: string;    // Email
  role: string;   // Role
  userId: string; // ID
  exp: number;
  iat: number;
}

// --- PRODUCTOS & MENÚ ---

export interface ProductAdditional {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export interface Garnish {
  id: string;
  name: string;
  // Price removed as requested
  active: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock?: number; // NUEVO: Stock disponible
    imageUrl: string;
    categoryName?: string; // Backend response
    category: string; // Mapped from categoryId or used for UI grouping
    categoryId?: string; // Backend DTO
    available: boolean;
    
    // Changed from 'variants' to 'additionals' to match Backend
    additionals: ProductAdditional[];

    // NUEVO: Lista de guarniciones disponibles para este producto
    garnishes?: Garnish[]; 
    
    isDishOfTheDay?: boolean; // Frontend mapped property
    dishOfTheDay?: boolean;   // Backend raw property
}

export interface Category {
  id: string;
  name: string;
  active?: boolean;
  icon?: string; // Frontend decoration
}

// --- CARRITO & ÓRDENES (Frontend) ---

export interface CartItem {
  internalId: string; 
  productId: string;
  name: string;
  imageUrl: string;
  price: number; 
  quantity: number;
  selectedAdditionals: ProductAdditional[]; 
  selectedGarnishes: Garnish[]; // NUEVO
  subtotal: number;
}

// --- DTOs PARA REQUEST DE ORDEN ---

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  additionalIds: string[]; // Solo IDs para el backend
  garnishIds: string[]; // NUEVO: IDs de guarniciones elegidas
}

export interface OrderRequest {
  deliveryAddress?: string; // Opcional, backend usa la del usuario si es null
  items: OrderItemRequest[];
  // Campos nuevos para asegurar snapshot de datos
  customerName?: string;
  phone?: string;
  
  // Campos auxiliares
  notes?: string;
  paymentMethod?: 'cash' | 'transfer';
}

// --- DTOs PARA RESPUESTA DE ORDEN ---

export interface OrderItemAdditionalResponse {
  name: string;
  price: number;
}

export interface OrderItemGarnishResponse {
    id?: string;
    name: string;
}

export interface OrderItemResponse {
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  additionals: OrderItemAdditionalResponse[];
  garnishes?: OrderItemGarnishResponse[]; // NUEVO: Snapshot de guarniciones
}

export interface OrderResponse {
  id: string;
  userId: string;
  
  // Nuevos campos directos del backend
  userName?: string;
  userLastname?: string;
  userPhone?: string;

  createdAt: string; // ISO Date
  total: number;
  deliveryAddress: string;
  status?: OrderStatus;
  items: OrderItemResponse[];
  
  // Relación con usuario (si el backend la popula - legacy)
  user?: User;

  // Mapeo frontend para compatibilidad con UI existente
  number?: number; // Backend uses UUID, UI might need hash or substring
  details?: OrderDetails;
  
  // Frontend only: Flag for new order animation
  _isNew?: boolean;
}

// --- USUARIO ---

export interface User {
  id: string;
  firstName: string; // Updated from name
  lastName?: string; // Updated from surname
  phone?: string;
  email: string;
  address?: string;
  role: 'customer' | 'admin' | string; 
  token?: string; 
}

// Interfaces para los filtros de OrderService
export interface OrderFilters {
  dateSpecific?: Date;
  month?: number;
  year?: number;
  status?: OrderStatus;
  userEmail?: string;
}

// WebSocket Payload for Stock
export interface StockUpdateResponse {
    productId: string;
    newStock: number; // As per latest requirement
    stock?: number; // Backward compatibility if backend sends 'stock'
    available: boolean;
}

// WebSocket Payload for Menu Updates (Admin changes)
export interface MenuUpdateEvent {
    type: 'PRODUCT_CREATED' | 'PRODUCT_UPDATED' | 'PRODUCT_DELETED';
    product?: Product; // For CREATE/UPDATE
    productId?: string; // For DELETE
}
