import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="container py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
              <p className="text-muted-foreground text-lg">We&apos;re here to help. Reach out to us anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <MessageCircle className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>WhatsApp Support</CardTitle>
                  <CardDescription>Get instant help via WhatsApp</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold mb-4">+1 849 486 5098</p>
                  <Button className="w-full" asChild>
                    <a href="https://wa.me/18494865098" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Mail className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>Send us an email anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-4 break-all">contact.kerventzweb@gmail.com</p>
                  <Button className="w-full bg-transparent" variant="outline" asChild>
                    <a href="mailto:contact.kerventzweb@gmail.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Support Hours</CardTitle>
                  <CardDescription>We&apos;re available 24/7</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday:</span>
                      <span className="font-medium">24 Hours</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Saturday - Sunday:</span>
                      <span className="font-medium">24 Hours</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="font-medium">Under 1 Hour</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Quick Help</CardTitle>
                  <CardDescription>Common questions answered</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span>Minimum deposit: $10</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span>Orders start instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span>Transfer fee: 5%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span>No withdrawal option</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-muted/50">
              <CardHeader>
                <CardTitle>Need Help with an Order?</CardTitle>
                <CardDescription>
                  If you&apos;re experiencing issues with an order, please have your order ID ready when contacting
                  support.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
