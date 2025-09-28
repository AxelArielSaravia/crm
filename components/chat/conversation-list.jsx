/**
 * @fileoverview Conversation list component
 * @type-check
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Button } from "../ui/button.jsx"

/**
 * Conversation list item component
 * @param {Object} props - Component props
 * @param {Object} props.conversation - Conversation data
 * @param {boolean} props.isActive - Whether conversation is active
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} Conversation list item
 */
function ConversationItem({ conversation, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(conversation)}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{conversation.title}</h4>
          <p className="text-sm text-muted-foreground truncate">
            {conversation.customer_name || conversation.customer_email || "Unknown Customer"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex px-2 py-1 text-xs rounded-full ${
              conversation.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : conversation.status === "closed"
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {conversation.status}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(conversation.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Conversation list component
 * @param {Object} props - Component props
 * @param {Array} props.conversations - List of conversations
 * @param {string} [props.activeConversationId] - Active conversation ID
 * @param {Function} props.onSelectConversation - Conversation select handler
 * @param {Function} props.onNewConversation - New conversation handler
 * @param {boolean} [props.isLoading] - Loading state
 * @returns {JSX.Element} Conversation list component
 */
export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle className="text-foreground">Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Conversations</CardTitle>
          <Button
            onClick={onNewConversation}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            New Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {conversations.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={onSelectConversation}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-muted-foreground text-sm">No conversations yet. Start your first chat!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
