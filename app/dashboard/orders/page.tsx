import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500"
      case "processing":
        return "bg-blue-500/10 text-blue-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "failed":
      case "refunded":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">View and manage your service orders</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>All your service orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.service_name}</p>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.quantity} {order.service_type} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-md">{order.target_url}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(order.price).toFixed(2)}</p>
                    {order.api_order_id && <p className="text-xs text-muted-foreground">ID: {order.api_order_id}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button asChild>
                <Link href="/dashboard/orders/new">Place Your First Order</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
