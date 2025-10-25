// Environment variables configuration

export const env = {
  // Supabase (already configured)
  supabase: {
    url: process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
  },

  // Email configuration
  email: {
    provider: (process.env.EMAIL_PROVIDER || "gmail") as "gmail" | "sendgrid",
    from: process.env.EMAIL_FROM || "contact.kerventzweb@gmail.com",
    gmailUser: process.env.GMAIL_USER,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  },

  // SMS configuration (Twilio)
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  },

  // SMM API configuration
  smm: {
    apiUrl: process.env.SMM_API_URL,
    apiKey: process.env.SMM_API_KEY,
  },

  // Support contact
  support: {
    whatsapp: "+18494865098",
    email: "contact.kerventzweb@gmail.com",
  },
}
