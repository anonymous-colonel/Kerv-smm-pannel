"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [amount, setAmount] = useState("")
  const [proofUrl, setProofUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from("deposits")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setDeposits(data || [])
      }
    } catch (err) {
      console.error("Error fetching deposits:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const depositAmount = Number(amount)
      if (depositAmount < 10) {
        throw new Error("Minimum deposit amount is $10")
      }

      const { error: depositError } = await supabase.from("deposits").insert({
        user_id: user.id,
        amount: depositAmount,
        proof_url: proofUrl || null,
        status: "pending",
      })

      if (depositError) throw depositError

      // Create notification for admins
      const { data: admins } = await supabase.from("users").select("id").in("role", ["admin", "subadmin"])

      if (admins) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
          type: "deposit",
          title: "New Deposit Request",
          message: `User has requested a deposit of $${depositAmount}`,
          data: { user_id: user.id, amount: depositAmount },
        }))

        await supabase.from("notifications").insert(notifications)
      }

      toast({
        title: "Deposit Request Submitted",
        description: "Your deposit request has been submitted for review.",
      })

      setAmount("")
      setProofUrl("")
      setDialogOpen(false)
      fetchDeposits()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deposits</h1>
          <p className="text-muted-foreground">Manage your account deposits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Deposit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Deposit</DialogTitle>
              <DialogDescription>Submit a deposit request for admin approval</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="10"
                  step="0.01"
                  placeholder="10.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">Minimum deposit: $10</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="proofUrl">Payment Proof URL (Optional)</Label>
                <Input
                  id="proofUrl"
                  type="url"
                  placeholder="https://..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">Upload your payment proof to an image hosting service</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertDescription>
                  Your deposit will be reviewed by an admin. You&apos;ll receive a notification once it&apos;s
                  processed.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deposit History</CardTitle>
          <CardDescription>All your deposit requests and their status</CardDescription>
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
                      <p className="font-medium">${Number(deposit.amount).toFixed(2)}</p>
                      <Badge className={getStatusColor(deposit.status)}>{deposit.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(deposit.created_at).toLocaleDateString()} at{" "}
                      {new Date(deposit.created_at).toLocaleTimeString()}
                    </p>
                    {deposit.rejection_reason && (
                      <p className="text-sm text-destructive">Reason: {deposit.rejection_reason}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {deposit.reviewed_at && (
                      <p className="text-xs text-muted-foreground">
                        Reviewed: {new Date(deposit.reviewed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No deposits yet</p>
              <Button onClick={() => setDialogOpen(true)}>Make Your First Deposit</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
