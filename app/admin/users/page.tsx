"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UserCog, Ban, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [balanceAdjustment, setBalanceAdjustment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "client")
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error("Error fetching users:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuspend = async (userId: string, currentStatus: string) => {
    setIsProcessing(true)
    try {
      const supabase = createClient()
      const newStatus = currentStatus === "active" ? "suspended" : "active"

      const { error } = await supabase.from("users").update({ status: newStatus }).eq("id", userId)

      if (error) throw error

      // Log action
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("admin_logs").insert({
          admin_id: user.id,
          action: newStatus === "suspended" ? "suspend_user" : "activate_user",
          target_user_id: userId,
          target_type: "user",
          details: { status: newStatus },
        })
      }

      toast({
        title: newStatus === "suspended" ? "User Suspended" : "User Activated",
        description: `User has been ${newStatus}.`,
      })

      fetchUsers()
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update user status",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBalanceAdjustment = async () => {
    if (!selectedUser || !balanceAdjustment) return

    setIsProcessing(true)
    try {
      const supabase = createClient()
      const amount = Number(balanceAdjustment)

      const { error } = await supabase.rpc("update_user_balance", {
        user_id: selectedUser.id,
        amount: amount,
      })

      if (error) throw error

      // Create transaction
      await supabase.from("transactions").insert({
        user_id: selectedUser.id,
        type: "manual_adjustment",
        amount: Math.abs(amount),
        status: "completed",
        description: `Manual balance adjustment by admin: ${amount > 0 ? "+" : ""}${amount}`,
      })

      // Log action
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("admin_logs").insert({
          admin_id: user.id,
          action: "adjust_balance",
          target_user_id: selectedUser.id,
          target_type: "user",
          details: { amount: amount },
        })
      }

      toast({
        title: "Balance Updated",
        description: `User balance has been adjusted by $${amount}.`,
      })

      setSelectedUser(null)
      setBalanceAdjustment("")
      fetchUsers()
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to adjust balance",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage client accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage client accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.full_name}</p>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-xl font-bold">${Number(user.balance).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Balance</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                      <UserCog className="h-4 w-4 mr-1" />
                      Adjust
                    </Button>
                    <Button
                      size="sm"
                      variant={user.status === "active" ? "destructive" : "default"}
                      onClick={() => handleSuspend(user.id, user.status)}
                      disabled={isProcessing}
                    >
                      {user.status === "active" ? (
                        <>
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No users found</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Balance</DialogTitle>
            <DialogDescription>
              Manually adjust balance for {selectedUser?.full_name}
              <br />
              Current balance: ${Number(selectedUser?.balance || 0).toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustment">Amount (use negative to deduct)</Label>
              <Input
                id="adjustment"
                type="number"
                step="0.01"
                placeholder="10.00 or -10.00"
                value={balanceAdjustment}
                onChange={(e) => setBalanceAdjustment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                New balance will be: ${(Number(selectedUser?.balance || 0) + Number(balanceAdjustment || 0)).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleBalanceAdjustment}
                disabled={isProcessing || !balanceAdjustment}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Balance"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
