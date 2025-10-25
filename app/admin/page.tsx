import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wallet, ShoppingCart, TrendingUp, ArrowLeftRight } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData || userData.role !== "admin") {
    redirect("/dashboard")
  }

  // Get statistics
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "client")

  const { count: pendingDeposits } = await supabase
    .from("deposits")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { data: totalDepositsData } = await supabase.from("deposits").select("amount").eq("status", "approved")

  const totalDeposits = totalDepositsData?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  const { data: totalCommissionsData } = await supabase.from("transactions").select("amount").eq("type", "commission")

  const totalCommissions = totalCommissionsData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  const { data: recentDeposits } = await supabase
    .from("deposits")
    .select("*, user:users(full_name, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentUsers } = await supabase
    .from("users")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <AdminLayout user={userData}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your SMM panel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Active clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Deposits</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDeposits || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDeposits.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Approved deposits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commissions</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCommissions.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Transfer fees (5%)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              {recentDeposits && recentDeposits.length > 0 ? (
                <div className="space-y-4">
                  {recentDeposits.map((deposit) => (
                    <div key={deposit.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{deposit.user?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{deposit.user?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${Number(deposit.amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(deposit.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No pending deposits</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers && recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{u.full_name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${Number(u.balance).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No users yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
