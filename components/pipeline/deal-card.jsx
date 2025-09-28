/**
 * @fileoverview Deal card component for pipeline view
 * @type-check
 */

"use client"

import { Card, CardContent, CardHeader } from "../ui/card.jsx"
import { Button } from "../ui/button.jsx"

/**
 * Deal card component
 * @param {Object} props - Component props
 * @param {Object} props.deal - Deal data
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {boolean} [props.isDragging] - Whether card is being dragged
 * @returns {JSX.Element} Deal card component
 */
export function DealCard({ deal, onEdit, onDelete, isDragging = false }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No date set"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card
      className={`border-border cursor-pointer transition-all hover:shadow-md ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", deal.id)
        e.dataTransfer.effectAllowed = "move"
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-foreground text-sm line-clamp-2">{deal.title}</h4>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(deal)
              }}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              ✏️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(deal.id)
              }}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              🗑️
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-lg font-semibold text-foreground">{formatCurrency(deal.value)}</div>

          {deal.customer_name && <div className="text-sm text-muted-foreground">👤 {deal.customer_name}</div>}

          {deal.customer_email && (
            <div className="text-sm text-muted-foreground truncate">📧 {deal.customer_email}</div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>📅 {formatDate(deal.expected_close_date)}</span>
            <span className="bg-muted px-2 py-1 rounded">{deal.probability}%</span>
          </div>

          {deal.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{deal.description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
