/**
 * @fileoverview Dashboard sidebar navigation component
 * @type-check
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "../../lib/supabase/client.js"
import { useRouter } from "next/navigation"
import { useState } from "react"

/**
 * Navigation items for the sidebar
 * @type {Array<{href: string, label: string, icon: string}>}
 */
const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/conversations", label: "Conversations", icon: "💬" },
  { href: "/dashboard/agents", label: "Agents", icon: "🤖" },
  { href: "/dashboard/pipeline", label: "Pipeline", icon: "🔄" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
]

/**
 * Dashboard sidebar component
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @returns {JSX.Element} Sidebar navigation
 */
export function DashboardSidebar({ user }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-sans font-semibold text-sidebar-foreground">CRM AI</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">AI-Powered Customer Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-primary-foreground">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email || "User"}</p>
            <p className="text-xs text-sidebar-foreground/70">{user?.user_metadata?.first_name || "Member"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  )
}
