/**
 * @fileoverview Authentication error page component
 * @type-check
 */

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx"

/**
 * Authentication error page component
 * @param {Object} props - Component props
 * @param {Promise<{error: string}>} props.searchParams - Search parameters
 * @returns {JSX.Element} Error message
 */
export default async function AuthErrorPage({ searchParams }) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-sans text-foreground">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            {params?.error ? (
              <p className="text-sm text-muted-foreground text-center">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                An authentication error occurred. Please try again.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
