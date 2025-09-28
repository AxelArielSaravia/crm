/**
 * @fileoverview Agent card component for displaying agent information
 * @type-check
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Button } from "../ui/button.jsx"
import { useState } from "react"

/**
 * Agent card component
 * @param {Object} props - Component props
 * @param {Object} props.agent - Agent data
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onToggleStatus - Toggle status handler
 * @returns {JSX.Element} Agent card component
 */
export function AgentCard({ agent, onEdit, onDelete, onToggleStatus }) {
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handles status toggle
   */
  const handleToggleStatus = async () => {
    setIsLoading(true)
    await onToggleStatus(agent.id, !agent.is_active)
    setIsLoading(false)
  }

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-medium text-foreground">{agent.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{agent.description || "No description provided"}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                agent.is_active
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {agent.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Model:</span>
              <p className="font-medium text-foreground">{agent.model}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Temperature:</span>
              <p className="font-medium text-foreground">{agent.temperature}</p>
            </div>
          </div>

          {agent.system_prompt && (
            <div>
              <span className="text-muted-foreground text-sm">System Prompt:</span>
              <p className="text-sm text-foreground mt-1 line-clamp-2">{agent.system_prompt}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(agent)} className="flex-1">
              Edit
            </Button>
            <Button
              variant={agent.is_active ? "secondary" : "default"}
              size="sm"
              onClick={handleToggleStatus}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "..." : agent.is_active ? "Deactivate" : "Activate"}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(agent.id)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
