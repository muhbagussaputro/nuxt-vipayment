// Game Types
export interface Game {
  name: string
  slug: string
  image: string
  category: string
  price: number
  description: string
}

export interface GameService {
  code: string
  name: string
  price: {
    basic: number
    special?: number
  }
  status: 'available' | 'unavailable'
  need_data_no: boolean
  need_data_zone: boolean
  need_server: boolean
  need_quantity: boolean
}

// Prepaid Types
export interface PrepaidService {
  id: string
  name: string
  image: string
  price: number
  description: string
}

// Promotion Types
export interface Promotion {
  id: number
  type: string
  title: string
  description: string
  discount: string
  validUntil: Date
  backgroundImage?: string
}

// User Types
export interface User {
  name: string
  email: string
  totalTransactions: number
  totalSpent: number
}

// Transaction Types
export interface Transaction {
  id: string
  orderId: string
  serviceName: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  createdAt: Date
}

// Order Types
export interface OrderData {
  order_id: string
  service_name: string
  target: string
  price: number
  status: string
  created_at: string
}

// Payment Types
export interface PaymentMethod {
  code: string
  name: string
  icon?: string
  fee?: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ServiceListResponse {
  data: GameService[]
  total?: number
} 