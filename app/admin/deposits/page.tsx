"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const { toast } = useToast()

  useEffect(() => {
    fetchDeposits()
  }, [filter])

  const fetchDeposits = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from("deposits")
        .select("*, user:users(full_name, email)")
        .order("created_at", { ascending: false })

      if (filter !== "all") {
        query = query.eq("status", filter)
      }

      const { data, error } = await query

      if (error) throw error
      setDeposits(data || [])
    } catch (err) {
      console.error("Error fetching deposits:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (deposit: any) => {
    setIsProcessing(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Update deposit status
      const { error: depositError } = await supabase
        .from("deposits")
        .update({
          status: "approved",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", deposit.id)

      if (depositError) throw depositError

      // Update user balance
      const { error: balanceError } = await supabase.rpc("update_user_balance", {
        user_id: deposit.user_id,
        amount: deposit.amount,
      })

      if (balanceError) throw balanceError

      // Create transaction
      await supabase.from("transactions").insert({
        user_id: deposit.user_id,
        type: "deposit",
        amount: deposit.amount,
        status: "completed",
        description: "Deposit approved by admin",
        reference_id: deposit.id,
      })

      // Create notification
      await supabase.from("notifications").insert({
        user_id: deposit.user_id,
        type: "deposit",
        title: "Deposit Approved",
        message: `Your deposit of $${Number(deposit.amount).toFixed(2)} has been approved.`,
        data: { deposit_id: deposit.id },
      })

      // Log admin action
      await supabase.from("admin_logs").insert({
        admin_id: user.id,
        action: "approve_deposit",
        target_user_id: deposit.user_id,
        target_type: "deposit",
        details: { deposit_id: deposit.id, amount: deposit.amount },
      })

      toast({
        title: "Deposit Approved",
        description: `Deposit of $${Number(deposit.amount).toFixed(2)} has been approved.`,
      })

      setSelectedDeposit(null)
      fetchDeposits()
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to approve deposit",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (deposit: any) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Update deposit status
      const { error: depositError } = await supabase
        .from("deposits")
        .update({
          status: "rejected",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectionReason,
        })
        .eq("id", deposit.id)

      if (depositError) throw depositError

      // Create notification
      await supabase.from("notifications").insert({
        user_id: deposit.user_id,
        type: "deposit",
        title: "Deposit Rejected",
        message: `Your deposit of $${Number(deposit.amount).toFixed(2)} has been rejected. Reason: ${rejectionReason}`,
        data: { deposit_id: deposit.id },
      })

      // Log admin action
      await supabase.from("admin_logs").insert({
        admin_id: user.id,
        action: "reject_deposit",
        target_user_id: deposit.user_id,
        target_type: "deposit",
        details: { deposit_id: deposit.id, amount: deposit.amount, reason: rejectionReason },
      })

      toast({
        title: "Deposit Rejected",
        description: "Deposit has been rejected.",
      })

      setSelectedDeposit(null)
      setRejectionReason("")
      fetchDeposits()
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to reject deposit",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "rejected":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
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
        <h1 className="text-3xl font-bold">Deposit Management</h1>
        <p className="text-muted-foreground">Review and approve deposit requests</p>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
          Pending
        </Button>
        <Button variant={filter === "approved" ? "default" : "outline"} onClick={() => setFilter("approved")}>
          Approved
        </Button>
        <Button variant={filter === "rejected" ? "default" : "outline"} onClick={() => setFilter("rejected")}>
          Rejected
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deposits</CardTitle>
          <CardDescription>Manage user deposit requests</CardDescription>
        </CardHeader>
        <CardContent>
          {deposits.length > 0 ? (
            <div className="space-y-4">
              {deposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{deposit.user?.full_name}</p>
                      <Badge className={getStatusColor(deposit.status)}>{deposit.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{deposit.user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(deposit.created_at).toLocaleDateString()} at{" "}
                      {new Date(deposit.created_at).toLocaleTimeString()}
                    </p>
                    {deposit.proof_url && (
                      <a
                        href={deposit.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View Proof
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-2xl font-bold">${Number(deposit.amount).toFixed(2)}</p>
                    </div>
                    {deposit.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(deposit)} disabled={isProcessing}>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedDeposit(deposit)}
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No deposits found</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedDeposit} onOpenChange={() => setSelectedDeposit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Deposit</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this deposit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedDeposit(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => selectedDeposit && handleReject(selectedDeposit)}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Deposit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
