// SMM API integration for ordering services

export interface SMMService {
  id: string
  name: string
  platform: "whatsapp" | "facebook" | "instagram" | "youtube" | "tiktok"
  type: "followers" | "likes" | "views" | "comments" | "shares"
  price: number
  min: number
  max: number
  description: string
}

export interface SMMOrder {
  service: string
  link: string
  quantity: number
}

export interface SMMOrderResponse {
  success: boolean
  orderId?: string
  error?: string
  message?: string
}

export class SMMAPIService {
  private apiUrl: string
  private apiKey: string

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  // Get available services
  async getServices(): Promise<SMMService[]> {
    try {
      const response = await fetch(`${this.apiUrl}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: this.apiKey }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching SMM services:", error)
      return []
    }
  }

  // Place an order
  async placeOrder(order: SMMOrder): Promise<SMMOrderResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: this.apiKey,
          action: "add",
          service: order.service,
          link: order.link,
          quantity: order.quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        return {
          success: false,
          error: data.error || "Order failed",
          message: "Stock terminé ou périmé. Contactez l'assistance WhatsApp : +18494865098.",
        }
      }

      return {
        success: true,
        orderId: data.order,
      }
    } catch (error) {
      console.error("Error placing SMM order:", error)
      return {
        success: false,
        error: "Network error",
        message: "Stock terminé ou périmé. Contactez l'assistance WhatsApp : +18494865098.",
      }
    }
  }

  // Check order status
  async checkOrderStatus(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: this.apiKey,
          action: "status",
          order: orderId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to check order status")
      }

      return await response.json()
    } catch (error) {
      console.error("Error checking order status:", error)
      return null
    }
  }

  // Get account balance
  async getBalance(): Promise<number | null> {
    try {
      const response = await fetch(`${this.apiUrl}/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: this.apiKey }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch balance")
      }

      const data = await response.json()
      return data.balance
    } catch (error) {
      console.error("Error fetching SMM balance:", error)
      return null
    }
  }
}
