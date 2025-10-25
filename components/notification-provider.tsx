"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { NotificationService, type RealtimeNotification } from "@/lib/notifications/realtime"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  notifications: RealtimeNotification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({
  children,
  userId,
}: {
  children: ReactNode
  userId: string
}) {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()
  const notificationService = new NotificationService()

  useEffect(() => {
    if (!userId) return

    // Load initial notifications
    refreshNotifications()

    // Subscribe to real-time updates
    const channel = notificationService.subscribeToNotifications(userId, (notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000,
      })

      // Play notification sound (optional)
      if (typeof window !== "undefined" && "Audio" in window) {
        const audio = new Audio("/notification.mp3")
        audio.play().catch(() => {}) // Ignore errors if sound fails
      }
    })

    return () => {
      notificationService.unsubscribe()
    }
  }, [userId])

  const refreshNotifications = async () => {
    try {
      const { createBrowserClient } = await import("@/lib/supabase/client")
      const supabase = createBrowserClient()

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])

      const unread = data?.filter((n) => !n.read).length || 0
      setUnreadCount(unread)
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
