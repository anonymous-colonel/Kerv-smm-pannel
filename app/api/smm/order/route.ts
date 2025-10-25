import { type NextRequest, NextResponse } from "next/server"
import { SMMAPIService } from "@/lib/integrations/smm-api"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { service, link, quantity, price } = body

    // Check user balance
    const { data: profile } = await supabase.from("user_profiles").select("balance").eq("user_id", user.id).single()

    const totalCost = price * quantity

    if (!profile || profile.balance < totalCost) {
      return NextResponse.json({ success: false, error: "Solde insuffisant" }, { status: 400 })
    }

    // Place order with SMM API
    const apiUrl = process.env.SMM_API_URL || "https://api.example.com"
    const apiKey = process.env.SMM_API_KEY || "your-api-key"
    const smmService = new SMMAPIService(apiUrl, apiKey)

    const orderResult = await smmService.placeOrder({ service, link, quantity })

    if (!orderResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: orderResult.message || "Order failed",
        },
        { status: 400 },
      )
    }

    // Deduct balance and create order record
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ balance: profile.balance - totalCost })
      .eq("user_id", user.id)

    if (updateError) throw updateError

    const { error: orderError } = await supabase.from("orders").insert({
      user_id: user.id,
      service_id: service,
      link,
      quantity,
      price: totalCost,
      status: "processing",
      api_order_id: orderResult.orderId,
    })

    if (orderError) throw orderError

    // Create transaction record
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "order",
      amount: totalCost,
      status: "completed",
    })

    // Send notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "order_completed",
      title: "Commande créée",
      message: `Votre commande de ${quantity} ${service} a été créée avec succès.`,
    })

    return NextResponse.json({ success: true, orderId: orderResult.orderId })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
