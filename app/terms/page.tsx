import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="container py-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    By accessing and using KERV SMM PANEL, you accept and agree to be bound by the terms and provision
                    of this agreement.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Service Description</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    KERV SMM PANEL provides social media marketing services including but not limited to followers,
                    likes, views, and engagement for various social media platforms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. User Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <ul>
                    <li>You must provide accurate and complete information during registration</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must not use the service for any illegal or unauthorized purpose</li>
                    <li>You must not violate any laws in your jurisdiction</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Payment Terms</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <ul>
                    <li>Minimum deposit amount is $10</li>
                    <li>All deposits must be approved by an administrator</li>
                    <li>Transfer fees of 5% apply to all credit transfers between users</li>
                    <li>No refunds or withdrawals are available</li>
                    <li>Prices are subject to change without notice</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Service Delivery</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <ul>
                    <li>Orders typically start within minutes of placement</li>
                    <li>Delivery times vary by service and quantity</li>
                    <li>We do not guarantee specific delivery times</li>
                    <li>Refunds may be issued if service cannot be delivered</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    KERV SMM PANEL shall not be liable for any indirect, incidental, special, consequential or punitive
                    damages resulting from your use of or inability to use the service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    We reserve the right to modify these terms at any time. Continued use of the service after changes
                    constitutes acceptance of the new terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>For questions about these Terms of Service, please contact us:</p>
                  <ul>
                    <li>Email: contact.kerventzweb@gmail.com</li>
                    <li>WhatsApp: +1 849 486 5098</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
