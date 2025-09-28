/**
 * @fileoverview Pipeline settings component for managing stages
 * @type-check
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Button } from "../ui/button.jsx"
import { Input } from "../ui/input.jsx"
import { Label } from "../ui/label.jsx"

/**
 * Pipeline stage item component
 * @param {Object} props - Component props
 * @param {Object} props.stage - Stage data
 * @param {Function} props.onUpdate - Update handler
 * @param {Function} props.onDelete - Delete handler
 * @returns {JSX.Element} Pipeline stage item
 */
function PipelineStageItem({ stage, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: stage.name,
    description: stage.description || "",
    color: stage.color,
  })

  const handleSave = () => {
    onUpdate(stage.id, editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: stage.name,
      description: stage.description || "",
      color: stage.color,
    })
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: isEditing ? editData.color : stage.color }}
      />

      {isEditing ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            value={editData.name}
            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Stage name"
            className="bg-background border-border text-foreground"
          />
          <Input
            value={editData.description}
            onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description (optional)"
            className="bg-background border-border text-foreground"
          />
          <Input
            type="color"
            value={editData.color}
            onChange={(e) => setEditData((prev) => ({ ...prev, color: e.target.value }))}
            className="bg-background border-border text-foreground h-10"
          />
        </div>
      ) : (
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{stage.name}</h4>
          {stage.description && <p className="text-sm text-muted-foreground">{stage.description}</p>}
        </div>
      )}

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(stage.id)}
              disabled={stage.name === "Closed Won" || stage.name === "Closed Lost"}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Pipeline settings component
 * @param {Object} props - Component props
 * @param {Array} props.stages - Pipeline stages
 * @param {Function} props.onUpdateStage - Stage update handler
 * @param {Function} props.onDeleteStage - Stage delete handler
 * @param {Function} props.onCreateStage - Stage create handler
 * @param {boolean} [props.isLoading] - Loading state
 * @returns {JSX.Element} Pipeline settings component
 */
export function PipelineSettings({ stages, onUpdateStage, onDeleteStage, onCreateStage, isLoading = false }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStage, setNewStage] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  })

  const handleCreateStage = () => {
    if (newStage.name.trim()) {
      onCreateStage(newStage)
      setNewStage({ name: "", description: "", color: "#3b82f6" })
      setShowAddForm(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Pipeline Stages</CardTitle>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add Stage
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Stage Name</Label>
                  <Input
                    value={newStage.name}
                    onChange={(e) => setNewStage((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Negotiation"
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Input
                    value={newStage.description}
                    onChange={(e) => setNewStage((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Color</Label>
                  <Input
                    type="color"
                    value={newStage.color}
                    onChange={(e) => setNewStage((prev) => ({ ...prev, color: e.target.value }))}
                    className="bg-background border-border text-foreground h-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleCreateStage} size="sm">
                  Create Stage
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {stages.map((stage) => (
            <PipelineStageItem key={stage.id} stage={stage} onUpdate={onUpdateStage} onDelete={onDeleteStage} />
          ))}
        </div>

        {stages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pipeline stages found. Add your first stage to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
