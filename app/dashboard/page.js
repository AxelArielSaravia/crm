/**
 * @fileoverview Main dashboard page
 * @type-check
 */

import { createClient } from "../../lib/supabase/server.js"
import { DashboardHeader } from "../../components/dashboard/header.tsx"
import { StatsCard } from "../../components/dashboard/stats-card.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx"

/**
 * Fetches dashboard statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Dashboard stats
 */
async function getDashboardStats(userId) {
  const supabase = await createClient()

  // Get conversations count
  const { count: conversationsCount } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get agents count
  const { count: agentsCount } = await supabase
    .from("agents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get active conversations
  const { count: activeConversations } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active")

  // Get recent conversations
  const { data: recentConversations } = await supabase
    .from("conversations")
    .select("id, title, status, customer_name, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  return {
    conversationsCount: conversationsCount || 0,
    agentsCount: agentsCount || 0,
    activeConversations: activeConversations || 0,
    recentConversations: recentConversations || [],
  }
}

/**
 * Main dashboard page component
 * @returns {JSX.Element} Dashboard page
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const stats = await getDashboardStats(user.id)

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Dashboard" subtitle="Welcome back! Here's what's happening with your CRM." />

      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Conversations"
            value={stats.conversationsCount}
            icon="💬"
            change="+12% from last month"
            trend="up"
          />
          <StatsCard
            title="Active Conversations"
            value={stats.activeConversations}
            icon="🟢"
            change="+5% from last week"
            trend="up"
          />
          <StatsCard title="AI Agents" value={stats.agentsCount} icon="🤖" change="No change" trend="neutral" />
          <StatsCard title="Response Time" value="2.3s" icon="⚡" change="-15% faster" trend="up" />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentConversations.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentConversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{conversation.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {conversation.customer_name || "Unknown Customer"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            conversation.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {conversation.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No conversations yet. Start by creating your first agent!
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/dashboard/conversations"
                  className="flex items-center gap-3 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                >
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary">Start New Conversation</p>
                    <p className="text-sm text-muted-foreground">Begin a new customer interaction</p>
                  </div>
                </a>
                <a
                  href="/dashboard/agents"
                  className="flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary/70 rounded-lg transition-colors group"
                >
                  <span className="text-lg">🤖</span>
                  <div>
                    <p className="font-medium text-foreground">Create AI Agent</p>
                    <p className="text-sm text-muted-foreground">Set up a new AI assistant</p>
                  </div>
                </a>
                <a
                  href="/dashboard/pipeline"
                  className="flex items-center gap-3 p-3 bg-accent/50 hover:bg-accent/70 rounded-lg transition-colors group"
                >
                  <span className="text-lg">🔄</span>
                  <div>
                    <p className="font-medium text-foreground">Manage Pipeline</p>
                    <p className="text-sm text-muted-foreground">Track deals and opportunities</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
