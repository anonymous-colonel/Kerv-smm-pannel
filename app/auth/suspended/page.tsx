import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldAlert, Rocket } from "lucide-react"

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-xl">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              KERV SMM PANEL
            </span>
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Account Suspended</CardTitle>
              <CardDescription>Your account has been temporarily suspended</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please contact our support team for more information about your account status.
              </p>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <a href="https://wa.me/18494865098" target="_blank" rel="noopener noreferrer">
                    Contact Support
                  </a>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
