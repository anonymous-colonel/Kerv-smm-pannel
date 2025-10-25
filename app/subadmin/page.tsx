import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CheckCircle, XCircle } from "lucide-react"

export default async function SubAdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData || !["admin", "subadmin"].includes(userData.role)) {
    redirect("/dashboard")
  }

  const { count: pendingDeposits } = await supabase
    .from("deposits")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: approvedToday } = await supabase
    .from("deposits")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")
    .eq("reviewed_by", user.id)
    .gte("reviewed_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

  const { count: rejectedToday } = await supabase
    .from("deposits")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected")
    .eq("reviewed_by", user.id)
    .gte("reviewed_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

  const { data: recentDeposits } = await supabase
    .from("deposits")
    .select("*, user:users(full_name, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <AdminLayout user={userData}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sub Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage deposit requests</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedToday || 0}</div>
              <p className="text-xs text-muted-foreground">By you today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedToday || 0}</div>
              <p className="text-xs text-muted-foreground">By you today</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDeposits && recentDeposits.length > 0 ? (
              <div className="space-y-4">
                {recentDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{deposit.user?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{deposit.user?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(deposit.created_at).toLocaleDateString()} at{" "}
                        {new Date(deposit.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${Number(deposit.amount).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending deposits</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
