/**
 * @fileoverview Agent form component for creating/editing agents
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
 * Available AI models
 * @type {Array<{value: string, label: string}>}
 */
const AI_MODELS = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku" },
]

/**
 * Agent form component
 * @param {Object} props - Component props
 * @param {Object} [props.agent] - Agent data for editing
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} [props.isLoading] - Loading state
 * @returns {JSX.Element} Agent form component
 */
export function AgentForm({ agent, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: agent?.name || "",
    description: agent?.description || "",
    system_prompt: agent?.system_prompt || "",
    model: agent?.model || "gpt-3.5-turbo",
    temperature: agent?.temperature || 0.7,
    max_tokens: agent?.max_tokens || 1000,
    is_active: agent?.is_active ?? true,
  })

  /**
   * Handles form input changes
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} e - Change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseFloat(value) || 0 : value,
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
        <CardTitle className="text-foreground">{agent ? "Edit Agent" : "Create New Agent"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Agent Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Customer Support Agent"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-foreground">
                AI Model
              </Label>
              <select
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the agent's purpose"
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="system_prompt" className="text-foreground">
              System Prompt *
            </Label>
            <Textarea
              id="system_prompt"
              name="system_prompt"
              required
              value={formData.system_prompt}
              onChange={handleChange}
              placeholder="You are a helpful customer support agent. Your role is to..."
              rows={4}
              className="bg-background border-border text-foreground resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-foreground">
                Temperature ({formData.temperature})
              </Label>
              <input
                id="temperature"
                name="temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_tokens" className="text-foreground">
                Max Tokens
              </Label>
              <Input
                id="max_tokens"
                name="max_tokens"
                type="number"
                min="100"
                max="4000"
                value={formData.max_tokens}
                onChange={handleChange}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded border-border"
            />
            <Label htmlFor="is_active" className="text-foreground">
              Activate agent immediately
            </Label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
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
