// Email integration using Gmail App Password or SendGrid

export interface EmailConfig {
  provider: "gmail" | "sendgrid"
  from: string
  gmailUser?: string
  gmailAppPassword?: string
  sendgridApiKey?: string
}

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // In production, this would use Nodemailer or SendGrid
      // For now, we'll use a server action
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          config: this.config,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  }

  // Send OTP email
  async sendOTP(email: string, code: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: "KERV SMM Panel - Code de vérification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">KERV SMM PANEL</h2>
          <p>Votre code de vérification est :</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p>Ce code expire dans 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </div>
      `,
      text: `Votre code de vérification KERV SMM Panel est : ${code}. Ce code expire dans 10 minutes.`,
    })
  }

  // Send deposit notification
  async sendDepositNotification(email: string, amount: number, status: "approved" | "rejected"): Promise<boolean> {
    const statusText = status === "approved" ? "approuvé" : "rejeté"
    const statusColor = status === "approved" ? "#10b981" : "#ef4444"

    return this.sendEmail({
      to: email,
      subject: `KERV SMM Panel - Dépôt ${statusText}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">KERV SMM PANEL</h2>
          <p>Votre demande de dépôt a été <strong style="color: ${statusColor};">${statusText}</strong>.</p>
          <div style="background: #f3f4f6; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Montant :</strong> ${amount} FCFA</p>
            <p style="margin: 10px 0 0 0;"><strong>Statut :</strong> <span style="color: ${statusColor};">${statusText}</span></p>
          </div>
          ${status === "approved" ? "<p>Le montant a été ajouté à votre solde.</p>" : "<p>Pour plus d'informations, contactez le support.</p>"}
          <p style="color: #6b7280; font-size: 14px;">Support WhatsApp : +18494865098</p>
        </div>
      `,
      text: `Votre demande de dépôt de ${amount} FCFA a été ${statusText}.`,
    })
  }

  // Send transfer notification
  async sendTransferNotification(email: string, amount: number, from: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: "KERV SMM Panel - Transfert reçu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">KERV SMM PANEL</h2>
          <p>Vous avez reçu un transfert !</p>
          <div style="background: #f3f4f6; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Montant reçu :</strong> ${amount} FCFA</p>
            <p style="margin: 10px 0 0 0;"><strong>De :</strong> ${from}</p>
          </div>
          <p>Le montant a été ajouté à votre solde.</p>
        </div>
      `,
      text: `Vous avez reçu ${amount} FCFA de ${from}.`,
    })
  }
}
