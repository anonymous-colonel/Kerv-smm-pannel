import Link from "next/link"
import { Rocket, Mail, MessageSquare, Instagram, Facebook, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                KERV SMM PANEL
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional social media marketing services trusted by thousands of customers worldwide. Grow your
              presence on Instagram, Facebook, YouTube, TikTok, and Discord.
            </p>
            <div className="flex gap-3 pt-2">
              <Button size="icon" variant="outline" className="rounded-full bg-transparent" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent" asChild>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                  Instagram Services
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                  Facebook Services
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                  YouTube Services
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                  TikTok Services
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                  Discord Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Support</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Email</p>
                    <a
                      href="mailto:contact.kerventzweb@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors break-all"
                    >
                      contact.kerventzweb@gmail.com
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">WhatsApp</p>
                    <a
                      href="https://wa.me/18494865098"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +1 849 486 5098
                    </a>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">24/7 Support</span>
                  <br />
                  We're always here to help
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} KERV SMM PANEL. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Built with security and reliability in mind
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
