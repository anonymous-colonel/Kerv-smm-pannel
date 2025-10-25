"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus, ArrowLeftRight, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const COMMISSION_RATE = 0.05 // 5%

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recipientIdentifier, setRecipientIdentifier] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [userId, setUserId] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)

        // Get user balance
        const { data: userData } = await supabase.from("users").select("balance").eq("id", user.id).single()
        if (userData) {
          setUserBalance(userData.balance)
        }

        // Get transfers
        const { data, error } = await supabase
          .from("transfers")
          .select(
            "*, sender:users!transfers_sender_id_fkey(full_name, email), receiver:users!transfers_receiver_id_fkey(full_name, email)",
          )
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false })

        if (error) throw error
        setTransfers(data || [])
      }
    } catch (err) {
      console.error("Error fetching transfers:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTransferDetails = () => {
    const transferAmount = Number(amount) || 0
    const commission = transferAmount * COMMISSION_RATE
    const totalDeducted = transferAmount + commission
    const amountReceived = transferAmount

    return { transferAmount, commission, totalDeducted, amountReceived }
  }

  const { transferAmount, commission, totalDeducted, amountReceived } = calculateTransferDetails()

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

      if (transferAmount <= 0) {
        throw new Error("Transfer amount must be greater than 0")
      }

      if (totalDeducted > userBalance) {
        throw new Error("Insufficient balance for this transfer")
      }

      // Find recipient by email or full name
      const { data: recipient, error: recipientError } = await supabase
        .from("users")
        .select("id, full_name, email")
        .or(`email.eq.${recipientIdentifier},full_name.ilike.${recipientIdentifier}`)
        .single()

      if (recipientError || !recipient) {
        throw new Error("Recipient not found. Please check the name or email.")
      }

      if (recipient.id === user.id) {
        throw new Error("You cannot transfer to yourself")
      }

      // Create transfer
      const { data: transfer, error: transferError } = await supabase
        .from("transfers")
        .insert({
          sender_id: user.id,
          receiver_id: recipient.id,
          amount: transferAmount,
          commission: commission,
          total_deducted: totalDeducted,
          amount_received: amountReceived,
          status: "completed",
        })
        .select()
        .single()

      if (transferError) throw transferError

      // Update sender balance
      const { error: senderBalanceError } = await supabase.rpc("update_user_balance", {
        user_id: user.id,
        amount: -totalDeducted,
      })

      if (senderBalanceError) throw new Error("Failed to update sender balance")

      // Update receiver balance
      const { error: receiverBalanceError } = await supabase.rpc("update_user_balance", {
        user_id: recipient.id,
        amount: amountReceived,
      })

      if (receiverBalanceError) throw new Error("Failed to update receiver balance")

      // Create transaction records
      await supabase.from("transactions").insert([
        {
          user_id: user.id,
          type: "transfer_sent",
          amount: totalDeducted,
          commission: commission,
          status: "completed",
          description: `Transfer to ${recipient.full_name}`,
          reference_id: transfer.id,
        },
        {
          user_id: recipient.id,
          type: "transfer_received",
          amount: amountReceived,
          status: "completed",
          description: `Transfer from ${user.email}`,
          reference_id: transfer.id,
        },
        {
          user_id: user.id,
          type: "commission",
          amount: commission,
          status: "completed",
          description: "Transfer commission (5%)",
          reference_id: transfer.id,
        },
      ])

      // Create notifications
      await supabase.from("notifications").insert([
        {
          user_id: user.id,
          type: "transfer",
          title: "Transfer Sent",
          message: `You sent $${transferAmount.toFixed(2)} to ${recipient.full_name}`,
          data: { transfer_id: transfer.id },
        },
        {
          user_id: recipient.id,
          type: "transfer",
          title: "Transfer Received",
          message: `You received $${amountReceived.toFixed(2)} from ${user.email}`,
          data: { transfer_id: transfer.id },
        },
      ])

      toast({
        title: "Transfer Successful",
        description: `$${transferAmount.toFixed(2)} sent to ${recipient.full_name}`,
      })

      setAmount("")
      setRecipientIdentifier("")
      setDialogOpen(false)
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
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
          <h1 className="text-3xl font-bold">Transfers</h1>
          <p className="text-muted-foreground">Send credits to other users</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Credits</DialogTitle>
              <DialogDescription>Transfer credits to another user (5% commission applies)</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient (Name or Email)</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="john@example.com or John Doe"
                  value={recipientIdentifier}
                  onChange={(e) => setRecipientIdentifier(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="10.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {amount && Number(amount) > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transfer amount:</span>
                        <span>${transferAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commission (5%):</span>
                        <span>${commission.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your balance:</span>
                        <span>${userBalance.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-semibold">
                        <span>Total deducted:</span>
                        <span className="text-destructive">${totalDeducted.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Recipient receives:</span>
                        <span className="text-green-600">${amountReceived.toFixed(2)}</span>
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

              {totalDeducted > userBalance && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Insufficient balance for this transfer</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting || totalDeducted > userBalance}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    Send Transfer
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>All your sent and received transfers</CardDescription>
        </CardHeader>
        <CardContent>
          {transfers.length > 0 ? (
            <div className="space-y-4">
              {transfers.map((transfer) => {
                const isSender = transfer.sender_id === userId
                const otherUser = isSender ? transfer.receiver : transfer.sender

                return (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${isSender ? "bg-red-500/10" : "bg-green-500/10"}`}
                      >
                        {isSender ? (
                          <ArrowUpRight className="h-5 w-5 text-red-500" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {isSender ? "Sent to" : "Received from"} {otherUser?.full_name || otherUser?.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transfer.created_at).toLocaleDateString()} at{" "}
                          {new Date(transfer.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isSender ? "text-red-500" : "text-green-600"}`}>
                        {isSender ? "-" : "+"}$
                        {Number(isSender ? transfer.total_deducted : transfer.amount_received).toFixed(2)}
                      </p>
                      {isSender && transfer.commission > 0 && (
                        <p className="text-xs text-muted-foreground">Fee: ${Number(transfer.commission).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No transfers yet</p>
              <Button onClick={() => setDialogOpen(true)}>Make Your First Transfer</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
