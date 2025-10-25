"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
]

const SERVICE_TYPES = [
  { value: "followers", label: "Followers" },
  { value: "likes", label: "Likes" },
  { value: "views", label: "Views" },
  { value: "comments", label: "Comments" },
  { value: "shares", label: "Shares" },
  { value: "favorites", label: "Favorites" },
]

// Mock pricing (in real app, this would come from API/database)
const PRICING = {
  followers: 0.01,
  likes: 0.005,
  views: 0.003,
  comments: 0.02,
  shares: 0.015,
  favorites: 0.008,
}

export default function NewOrderPage() {
  const [platform, setPlatform] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [targetUrl, setTargetUrl] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userBalance, setUserBalance] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserBalance = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("users").select("balance").eq("id", user.id).single()
        if (data) {
          setUserBalance(data.balance)
        }
      }
    }
    fetchUserBalance()
  }, [])

  const calculatePrice = () => {
    if (!serviceType || !quantity) return 0
    const pricePerUnit = PRICING[serviceType as keyof typeof PRICING] || 0
    return pricePerUnit * Number(quantity)
  }

  const totalPrice = calculatePrice()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Check balance
      if (userBalance < totalPrice) {
        throw new Error("Insufficient balance. Please add funds to your account.")
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          service_name: `${platform} ${serviceType}`,
          platform,
          service_type: serviceType,
          target_url: targetUrl,
          quantity: Number(quantity),
          price: totalPrice,
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Deduct balance
      const { error: balanceError } = await supabase.rpc("update_user_balance", {
        user_id: user.id,
        amount: -totalPrice,
      })

      if (balanceError) {
        // Rollback order if balance update fails
        await supabase.from("orders").delete().eq("id", order.id)
        throw new Error("Failed to process payment. Please try again.")
      }

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "order",
        amount: totalPrice,
        status: "completed",
        description: `Order: ${platform} ${serviceType} x${quantity}`,
        reference_id: order.id,
      })

      // Create notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "order",
        title: "Order Placed Successfully",
        message: `Your order for ${quantity} ${serviceType} on ${platform} has been placed.`,
        data: { order_id: order.id },
      })

      toast({
        title: "Order Placed",
        description: "Your order has been submitted successfully.",
      })

      router.push("/dashboard/orders")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Order</h1>
        <p className="text-muted-foreground">Place a new service order</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Fill in the details for your service order</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={serviceType} onValueChange={setServiceType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="targetUrl">Target URL</Label>
                <Input
                  id="targetUrl"
                  type="url"
                  placeholder="https://..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL of the post, profile, or video you want to boost
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {serviceType && quantity && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per unit:</span>
                      <span>${PRICING[serviceType as keyof typeof PRICING]?.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your balance:</span>
                      <span>${userBalance.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                      <span>Total Price:</span>
                      <span className="text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {totalPrice > userBalance && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Insufficient balance. Please add funds to your account before placing this order.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading || totalPrice > userBalance}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          If the API provider is out of stock or credit, you&apos;ll see an error message. Contact support at WhatsApp:
          +1 849 486 5098
        </AlertDescription>
      </Alert>
    </div>
  )
}
