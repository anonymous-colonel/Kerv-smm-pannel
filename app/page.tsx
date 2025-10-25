import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Instagram,
  Facebook,
  Youtube,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Heart,
  Share2,
  Eye,
  Star,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Trusted by 10,000+ Customers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Grow Your Social Media{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Instantly</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Professional SMM services for Instagram, Facebook, YouTube, TikTok, and Discord. Fast delivery, affordable
              prices, and 24/7 support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#services">View Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Instant Delivery</CardTitle>
                <CardDescription>Orders start processing immediately after payment</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>100% Safe</CardTitle>
                <CardDescription>Secure payment and data protection guaranteed</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Best Prices</CardTitle>
                <CardDescription>Competitive rates with no hidden fees</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="container py-24">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from a wide range of social media marketing services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Instagram className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Instagram</CardTitle>
                <CardDescription>Followers, Likes, Views, Comments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Real Followers
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Post Likes
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Story Views
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Facebook className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Facebook</CardTitle>
                <CardDescription>Page Likes, Post Engagement, Shares</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Page Followers
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Post Likes
                  </li>
                  <li className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" /> Shares
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Youtube className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>YouTube</CardTitle>
                <CardDescription>Subscribers, Views, Likes, Comments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Subscribers
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Video Views
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Likes
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <svg className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <CardTitle>TikTok</CardTitle>
                <CardDescription>Followers, Likes, Views, Shares</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Followers
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Likes
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Views
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Discord</CardTitle>
                <CardDescription>Server Members, Boosts, Engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Server Members
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4" /> Server Boosts
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Online Members
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Popular</Badge>
                <CardTitle>Custom Packages</CardTitle>
                <CardDescription>Tailored solutions for your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Need something specific? Contact us for custom packages and bulk orders.
                </p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container py-24 bg-muted/50">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about our services
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the service work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply create an account, add funds to your balance, select the service you want, enter the required
                  details (like your profile URL), and place your order. Our automated system will start processing your
                  order immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I add funds to my account?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Go to the Deposits section in your dashboard and submit a deposit request with your payment proof. Our
                  admin team will review and approve your deposit within minutes. You can also receive funds from other
                  users via transfers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is it safe to use your services?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, absolutely! We use secure methods that comply with platform guidelines. Your account information
                  is encrypted and we never ask for your password. All transactions are processed securely.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does delivery take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most orders start processing immediately and are completed within minutes to a few hours, depending on
                  the service and quantity. Larger orders may take up to 24-48 hours for complete delivery.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I transfer credits to another user?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can transfer credits to other users by their username or email. A 5% commission fee applies
                  to all transfers. The recipient will receive a notification once the transfer is complete.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if my order fails or is incomplete?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If an order fails due to API issues or stock unavailability, your funds will be automatically refunded
                  to your account balance. You can then use those funds for another order or contact support for
                  assistance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds or withdrawals?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We do not offer cash withdrawals. However, if an order fails, funds are automatically returned to your
                  account balance. You can use your balance for future orders or transfer credits to other users.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground text-lg">Our support team is available 24/7 to assist you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full bg-green-500/10">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>WhatsApp Support</CardTitle>
                  </div>
                  <CardDescription>Get instant help via WhatsApp</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold mb-4">+1 849 486 5098</p>
                  <Button className="w-full" asChild>
                    <a href="https://wa.me/18494865098" target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <CardTitle>Email Support</CardTitle>
                  </div>
                  <CardDescription>Send us an email anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-4 break-all">contact.kerventzweb@gmail.com</p>
                  <Button className="w-full bg-transparent" variant="outline" asChild>
                    <a href="mailto:contact.kerventzweb@gmail.com">Send Email</a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Need Help Getting Started?</CardTitle>
                <CardDescription className="text-base">
                  Our team is ready to guide you through the process and answer any questions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Us Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24">
          <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <CardHeader className="text-center space-y-4 py-12">
              <CardTitle className="text-3xl md:text-4xl">Ready to Grow Your Social Media?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Join thousands of satisfied customers and start boosting your social media presence today.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">Create Free Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
