export type UserRole = "client" | "subadmin" | "admin"
export type UserStatus = "active" | "suspended" | "deleted"
export type TransactionType =
  | "deposit"
  | "transfer_sent"
  | "transfer_received"
  | "order"
  | "commission"
  | "refund"
  | "manual_adjustment"
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled"
export type DepositStatus = "pending" | "approved" | "rejected"
export type OrderStatus = "pending" | "processing" | "completed" | "failed" | "refunded"
export type Platform = "whatsapp" | "facebook" | "instagram" | "youtube" | "tiktok"
export type ServiceType = "followers" | "likes" | "shares" | "comments" | "views" | "favorites"
export type NotificationType = "deposit" | "transfer" | "order" | "system" | "admin"

export interface User {
  id: string
  full_name: string
  phone: string
  balance: number
  role: UserRole
  status: UserStatus
  failed_login_attempts: number
  locked_until: string | null
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  commission: number
  status: TransactionStatus
  description: string | null
  reference_id: string | null
  created_at: string
}

export interface Deposit {
  id: string
  user_id: string
  amount: number
  proof_url: string | null
  status: DepositStatus
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
}

export interface Transfer {
  id: string
  sender_id: string
  receiver_id: string
  amount: number
  commission: number
  total_deducted: number
  amount_received: number
  status: "completed" | "failed"
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  service_name: string
  platform: Platform
  service_type: ServiceType
  target_url: string
  quantity: number
  price: number
  status: OrderStatus
  api_order_id: string | null
  api_response: string | null
  created_at: string
  completed_at: string | null
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data: Record<string, unknown> | null
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_user_id: string | null
  target_type: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}
