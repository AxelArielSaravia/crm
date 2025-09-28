//ts-check

/**
 * @typedef {import("react").ReactNode} ReactNode
 */

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

/** @type {import('next').Metadata} */
export const metadata = {
  title: "CRM",
  description: "CRM",
}

/**@type{(a: {children: ReactNode}) => ReactNode}*/
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
