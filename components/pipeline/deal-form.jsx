/**
 * @fileoverview Deal form component for creating/editing deals
 * @type-check
 */

"use client"

import { Button } from "../ui/button.jsx"
import { Input } from "../ui/input.jsx"
import { Label } from "../ui/label.jsx"
import { Textarea } from "../ui/textarea.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { useState } from "react"

/**
 * Deal form component
 * @param {Object} props - Component props
 * @param {Object} [props.deal] - Deal data for editing
 * @param {Array} props.stages - Available pipeline stages
 * @param {Array} props.conversations - Available conversations
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.defaultStageId] - Default stage ID
 * @returns {JSX.Element} Deal form component
 */
export function DealForm({ deal, stages, conversations, onSubmit, onCancel, isLoading = false, defaultStageId }) {
  const [formData, setFormData] = useState({
    title: deal?.title || "",
    description: deal?.description || "",
    value: deal?.value || 0,
    customer_name: deal?.customer_name || "",
    customer_email: deal?.customer_email || "",
    expected_close_date: deal?.expected_close_date || "",
    probability: deal?.probability || 50,
    stage_id: deal?.stage_id || defaultStageId || stages[0]?.id || "",
    conversation_id: deal?.conversation_id || "",
  })

  /**
   * Handles form input changes
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} e - Change event
   */
  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{deal ? "Edit Deal" : "Create New Deal"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Deal Title *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enterprise Software License"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value" className="text-foreground">
                Deal Value ($)
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={handleChange}
                placeholder="10000"
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the deal..."
              rows={3}
              className="bg-background border-border text-foreground resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="text-foreground">
                Customer Name
              </Label>
              <Input
                id="customer_name"
                name="customer_name"
                type="text"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email" className="text-foreground">
                Customer Email
              </Label>
              <Input
                id="customer_email"
                name="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage_id" className="text-foreground">
                Pipeline Stage
              </Label>
              <select
                id="stage_id"
                name="stage_id"
                value={formData.stage_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability" className="text-foreground">
                Probability (%)
              </Label>
              <Input
                id="probability"
                name="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={handleChange}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_close_date" className="text-foreground">
                Expected Close Date
              </Label>
              <Input
                id="expected_close_date"
                name="expected_close_date"
                type="date"
                value={formData.expected_close_date}
                onChange={handleChange}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          {conversations.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="conversation_id" className="text-foreground">
                Link to Conversation (Optional)
              </Label>
              <select
                id="conversation_id"
                name="conversation_id"
                value={formData.conversation_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">No conversation linked</option>
                {conversations.map((conversation) => (
                  <option key={conversation.id} value={conversation.id}>
                    {conversation.title} - {conversation.customer_name || conversation.customer_email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
