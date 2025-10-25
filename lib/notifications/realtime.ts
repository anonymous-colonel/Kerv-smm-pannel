import { createBrowserClient } from "@/lib/supabase/client"

export type NotificationType =
  | "deposit_approved"
  | "deposit_rejected"
  | "transfer_received"
  | "order_completed"
  | "order_failed"
  | "balance_updated"
  | "admin_alert"

export interface RealtimeNotification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

export class NotificationService {
  private supabase = createBrowserClient()
  private channel: any = null

  // Subscribe to real-time notifications for a user
  subscribeToNotifications(userId: string, callback: (notification: RealtimeNotification) => void) {
    this.channel = this.supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as RealtimeNotification)
        },
      )
      .subscribe()

    return this.channel
  }

  // Unsubscribe from notifications
  unsubscribe() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const { error } = await this.supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    if (error) throw error
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const { error } = await this.supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw error
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw error
    return count || 0
  }

  // Create a notification (server-side)
  static async create(userId: string, type: NotificationType, title: string, message: string, data?: any) {
    const supabase = createBrowserClient()

    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title,
      message,
      data,
      read: false,
    })

    if (error) throw error
  }
}
