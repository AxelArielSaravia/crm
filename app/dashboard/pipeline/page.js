/**
 * @fileoverview Pipeline management page
 * @type-check
 */

"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../../lib/supabase/client.js"
import { DashboardHeader } from "../../../components/dashboard/header.tsx"
import { PipelineStage } from "../../../components/pipeline/pipeline-stage.tsx"
import { DealForm } from "../../../components/pipeline/deal-form.tsx"
import { Button } from "../../../components/ui/button.tsx"

/**
 * Pipeline management page component
 * @returns {JSX.Element} Pipeline page
 */
export default function PipelinePage() {
  const [stages, setStages] = useState([])
  const [deals, setDeals] = useState([])
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [defaultStageId, setDefaultStageId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const supabase = createClient()

  /**
   * Fetches pipeline data from database
   */
  const fetchPipelineData = async () => {
    try {
      // Fetch stages
      const { data: stagesData, error: stagesError } = await supabase
        .from("pipeline_stages")
        .select("*")
        .order("position")

      if (stagesError) throw stagesError

      // Fetch deals
      const { data: dealsData, error: dealsError } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false })

      if (dealsError) throw dealsError

      // Fetch conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("conversations")
        .select("id, title, customer_name, customer_email")
        .order("updated_at", { ascending: false })

      if (conversationsError) throw conversationsError

      setStages(stagesData || [])
      setDeals(dealsData || [])
      setConversations(conversationsData || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPipelineData()
  }, [])

  /**
   * Groups deals by stage
   * @returns {Object} Deals grouped by stage ID
   */
  const getDealsByStage = () => {
    return deals.reduce((acc, deal) => {
      if (!acc[deal.stage_id]) {
        acc[deal.stage_id] = []
      }
      acc[deal.stage_id].push(deal)
      return acc
    }, {})
  }

  /**
   * Handles deal creation/update
   * @param {Object} formData - Deal form data
   */
  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      if (editingDeal) {
        // Update existing deal
        const { error } = await supabase.from("deals").update(formData).eq("id", editingDeal.id)

        if (error) throw error
      } else {
        // Create new deal
        const { error } = await supabase.from("deals").insert([{ ...formData, user_id: user.id }])

        if (error) throw error
      }

      await fetchPipelineData()
      setShowForm(false)
      setEditingDeal(null)
      setDefaultStageId(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles deal editing
   * @param {Object} deal - Deal to edit
   */
  const handleDealEdit = (deal) => {
    setEditingDeal(deal)
    setShowForm(true)
  }

  /**
   * Handles deal deletion
   * @param {string} dealId - Deal ID to delete
   */
  const handleDealDelete = async (dealId) => {
    if (!confirm("Are you sure you want to delete this deal?")) return

    try {
      const { error } = await supabase.from("deals").delete().eq("id", dealId)

      if (error) throw error
      await fetchPipelineData()
    } catch (err) {
      setError(err.message)
    }
  }

  /**
   * Handles deal movement between stages
   * @param {string} dealId - Deal ID
   * @param {string} newStageId - New stage ID
   */
  const handleDealMove = async (dealId, newStageId) => {
    try {
      const { error } = await supabase.from("deals").update({ stage_id: newStageId }).eq("id", dealId)

      if (error) throw error
      await fetchPipelineData()
    } catch (err) {
      setError(err.message)
    }
  }

  /**
   * Handles adding a new deal to a specific stage
   * @param {string} stageId - Stage ID
   */
  const handleAddDeal = (stageId) => {
    setDefaultStageId(stageId)
    setShowForm(true)
  }

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    setShowForm(false)
    setEditingDeal(null)
    setDefaultStageId(null)
    setError(null)
  }

  /**
   * Calculates pipeline statistics
   */
  const getPipelineStats = () => {
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
    const weightedValue = deals.reduce((sum, deal) => sum + ((deal.value || 0) * (deal.probability || 0)) / 100, 0)

    return {
      totalDeals: deals.length,
      totalValue,
      weightedValue,
    }
  }

  const stats = getPipelineStats()
  const dealsByStage = getDealsByStage()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader title="Pipeline" subtitle="Loading..." />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading pipeline...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader
        title="Sales Pipeline"
        subtitle="Track deals and opportunities through your sales process"
        actions={
          !showForm && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.totalDeals} deals • {formatCurrency(stats.totalValue)} total •{" "}
                {formatCurrency(stats.weightedValue)} weighted
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Deal
              </Button>
            </div>
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
            <DealForm
              deal={editingDeal}
              stages={stages}
              conversations={conversations}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              defaultStageId={defaultStageId}
            />
          </div>
        )}

        {!showForm && (
          <>
            {stages.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {stages.map((stage) => (
                  <PipelineStage
                    key={stage.id}
                    stage={stage}
                    deals={dealsByStage[stage.id] || []}
                    onDealEdit={handleDealEdit}
                    onDealDelete={handleDealDelete}
                    onDealMove={handleDealMove}
                    onAddDeal={handleAddDeal}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔄</div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Pipeline Stages</h3>
                <p className="text-muted-foreground mb-6">
                  Your pipeline stages will be created automatically when you sign up. If you don't see any stages, try
                  refreshing the page.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
