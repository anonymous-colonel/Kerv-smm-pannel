import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wallet, ShoppingCart, ArrowLeftRight, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData) {
    redirect("/auth/login")
  }

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get statistics
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { data: totalSpent } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", user.id)
    .eq("type", "order")
    .eq("status", "completed")

  const totalSpentAmount = totalSpent?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  return (
    <DashboardLayout user={userData}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userData.full_name}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your account</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${userData.balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Available to spend</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpentAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Lifetime spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button size="sm" className="w-full" asChild>
                  <Link href="/dashboard/orders/new">New Order</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest service orders</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{order.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.platform} • {order.quantity} {order.service_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number(order.price).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/dashboard/orders">View All Orders</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button asChild>
                  <Link href="/dashboard/orders/new">Place Your First Order</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions && recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium capitalize">{transaction.type.replace("_", " ")}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type.includes("received") ? "text-green-600" : ""}`}>
                        {transaction.type.includes("received") ? "+" : "-"}${Number(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
