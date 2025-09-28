/**
 * @fileoverview Pipeline stage column component
 * @type-check
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { DealCard } from "./deal-card.jsx"
import { useState } from "react"

/**
 * Pipeline stage component
 * @param {Object} props - Component props
 * @param {Object} props.stage - Stage data
 * @param {Array} props.deals - Deals in this stage
 * @param {Function} props.onDealEdit - Deal edit handler
 * @param {Function} props.onDealDelete - Deal delete handler
 * @param {Function} props.onDealMove - Deal move handler
 * @param {Function} props.onAddDeal - Add deal handler
 * @returns {JSX.Element} Pipeline stage component
 */
export function PipelineStage({ stage, deals, onDealEdit, onDealDelete, onDealMove, onAddDeal }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(amount)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const dealId = e.dataTransfer.getData("text/plain")
    if (dealId) {
      onDealMove(dealId, stage.id)
    }
  }

  return (
    <div className="flex-shrink-0 w-80">
      <Card
        className={`border-border h-full ${isDragOver ? "ring-2 ring-primary ring-opacity-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
              <CardTitle className="text-sm font-medium text-foreground">{stage.name}</CardTitle>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{deals.length}</span>
            </div>
            <button
              onClick={() => onAddDeal(stage.id)}
              className="text-muted-foreground hover:text-foreground text-lg"
              title="Add deal"
            >
              +
            </button>
          </div>
          {totalValue > 0 && (
            <div className="text-sm font-medium text-muted-foreground">{formatCurrency(totalValue)}</div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} onEdit={onDealEdit} onDelete={onDealDelete} />
            ))}
            {deals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-2xl mb-2">📋</div>
                <p className="text-sm">No deals in this stage</p>
                <button
                  onClick={() => onAddDeal(stage.id)}
                  className="text-primary hover:text-primary/80 text-sm mt-2 underline"
                >
                  Add your first deal
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
