import { type NextRequest, NextResponse } from "next/server"
import { SMMAPIService } from "@/lib/integrations/smm-api"

export async function GET(request: NextRequest) {
  try {
    // In production, get these from environment variables
    const apiUrl = process.env.SMM_API_URL || "https://api.example.com"
    const apiKey = process.env.SMM_API_KEY || "your-api-key"

    const smmService = new SMMAPIService(apiUrl, apiKey)
    const services = await smmService.getServices()

    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error("Error fetching SMM services:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 })
  }
}
