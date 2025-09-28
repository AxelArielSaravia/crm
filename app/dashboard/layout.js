/**
 * @fileoverview Dashboard layout component
 * @type-check
 */

import { redirect } from "next/navigation"
import { createClient } from "../../lib/supabase/server.js"
import { DashboardSidebar } from "../../components/dashboard/sidebar.tsx"

/**
 * Dashboard layout component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Dashboard layout
 */
export default async function DashboardLayout({ children }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <DashboardSidebar user={data.user} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  )
}
