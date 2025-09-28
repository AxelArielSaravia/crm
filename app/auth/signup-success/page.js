/**
 * @fileoverview Sign up success page component
 * @type-check
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.tsx"

/**
 * Sign up success page component
 * @returns {JSX.Element} Success message
 */
export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-sans text-foreground">Check Your Email</CardTitle>
            <CardDescription className="text-muted-foreground">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              sign in to access your CRM dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
