/**
 * @fileoverview Agents management page
 * @type-check
 */

"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../../lib/supabase/client.js"
import { DashboardHeader } from "../../../components/dashboard/header.tsx"
import { AgentCard } from "../../../components/agents/agent-card.tsx"
import { AgentForm } from "../../../components/agents/agent-form.tsx"
import { Button } from "../../../components/ui/button.tsx"

/**
 * Agents management page component
 * @returns {JSX.Element} Agents page
 */
export default function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const supabase = createClient()

  /**
   * Fetches agents from database
   */
  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase.from("agents").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  /**
   * Handles agent creation/update
   * @param {Object} formData - Agent form data
   */
  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      if (editingAgent) {
        // Update existing agent
        const { error } = await supabase.from("agents").update(formData).eq("id", editingAgent.id)

        if (error) throw error
      } else {
        // Create new agent
        const { error } = await supabase.from("agents").insert([{ ...formData, user_id: user.id }])

        if (error) throw error
      }

      await fetchAgents()
      setShowForm(false)
      setEditingAgent(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles agent editing
   * @param {Object} agent - Agent to edit
   */
  const handleEdit = (agent) => {
    setEditingAgent(agent)
    setShowForm(true)
  }

  /**
   * Handles agent deletion
   * @param {string} agentId - Agent ID to delete
   */
  const handleDelete = async (agentId) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const { error } = await supabase.from("agents").delete().eq("id", agentId)

      if (error) throw error
      await fetchAgents()
    } catch (err) {
      setError(err.message)
    }
  }

  /**
   * Handles agent status toggle
   * @param {string} agentId - Agent ID
   * @param {boolean} isActive - New active status
   */
  const handleToggleStatus = async (agentId, isActive) => {
    try {
      const { error } = await supabase.from("agents").update({ is_active: isActive }).eq("id", agentId)

      if (error) throw error
      await fetchAgents()
    } catch (err) {
      setError(err.message)
    }
  }

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    setShowForm(false)
    setEditingAgent(null)
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader title="AI Agents" subtitle="Loading..." />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading agents...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader
        title="AI Agents"
        subtitle="Manage your AI assistants and their configurations"
        actions={
          !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Agent
            </Button>
          )
        }
      />

      <main className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <AgentForm agent={editingAgent} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isSubmitting} />
          </div>
        )}

        {!showForm && (
          <>
            {agents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-lg font-medium text-foreground mb-2">No AI Agents Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first AI agent to start automating customer interactions.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create Your First Agent
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
