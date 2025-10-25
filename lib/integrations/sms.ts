// SMS integration using Twilio

export interface SMSConfig {
  accountSid: string
  authToken: string
  fromNumber: string
}

export class SMSService {
  private config: SMSConfig

  constructor(config: SMSConfig) {
    this.config = config
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // In production, this would use Twilio SDK
      // For now, we'll use a server action
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          message,
          config: this.config,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Error sending SMS:", error)
      return false
    }
  }

  // Send OTP SMS
  async sendOTP(phone: string, code: string): Promise<boolean> {
    const message = `KERV SMM Panel - Votre code de vérification est : ${code}. Ce code expire dans 10 minutes.`
    return this.sendSMS(phone, message)
  }

  // Send deposit notification
  async sendDepositNotification(phone: string, amount: number, status: "approved" | "rejected"): Promise<boolean> {
    const statusText = status === "approved" ? "approuvé" : "rejeté"
    const message = `KERV SMM Panel - Votre dépôt de ${amount} FCFA a été ${statusText}.`
    return this.sendSMS(phone, message)
  }

  // Send transfer notification
  async sendTransferNotification(phone: string, amount: number): Promise<boolean> {
    const message = `KERV SMM Panel - Vous avez reçu ${amount} FCFA.`
    return this.sendSMS(phone, message)
  }
}
