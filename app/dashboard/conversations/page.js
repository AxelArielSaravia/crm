/**
 * @fileoverview Conversations page with real-time chat
 * @type-check
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "../../../lib/supabase/client.js"
import { DashboardHeader } from "../../../components/dashboard/header.tsx"
import { ConversationList } from "../../../components/chat/conversation-list.tsx"
import { MessageBubble } from "../../../components/chat/message-bubble.tsx"
import { ChatInput } from "../../../components/chat/chat-input.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx"
import { Button } from "../../../components/ui/button.tsx"
import { Input } from "../../../components/ui/input.tsx"
import { Label } from "../../../components/ui/label.tsx"

/**
 * Conversations page component
 * @returns {JSX.Element} Conversations page
 */
export default function ConversationsPage() {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showNewConversationForm, setShowNewConversationForm] = useState(false)
  const [newConversationData, setNewConversationData] = useState({
    title: "",
    customer_name: "",
    customer_email: "",
    agent_id: "",
  })

  const messagesEndRef = useRef(null)
  const supabase = createClient()

  /**
   * Scrolls to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  /**
   * Fetches conversations from database
   */
  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase.from("conversations").select("*").order("updated_at", { ascending: false })

      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error("Error fetching conversations:", error)
    }
  }

  /**
   * Fetches agents from database
   */
  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase.from("agents").select("*").eq("is_active", true).order("name")

      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error("Error fetching agents:", error)
    }
  }

  /**
   * Fetches messages for a conversation
   * @param {string} conversationId - Conversation ID
   */
  const fetchMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  /**
   * Sets up real-time subscription for messages
   * @param {string} conversationId - Conversation ID
   */
  const setupRealtimeSubscription = (conversationId) => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
          scrollToBottom()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchConversations(), fetchAgents()])
      setIsLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id)
      const unsubscribe = setupRealtimeSubscription(activeConversation.id)
      return unsubscribe
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * Handles conversation selection
   * @param {Object} conversation - Selected conversation
   */
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation)
    setShowNewConversationForm(false)
  }

  /**
   * Handles new conversation creation
   */
  const handleNewConversation = () => {
    setShowNewConversationForm(true)
    setActiveConversation(null)
  }

  /**
   * Creates a new conversation
   */
  const createConversation = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("conversations")
        .insert([
          {
            ...newConversationData,
            user_id: user.id,
            status: "active",
          },
        ])
        .select()
        .single()

      if (error) throw error

      await fetchConversations() // Update conversation list
      setActiveConversation(data)
      setShowNewConversationForm(false)
      setNewConversationData({
        title: "",
        customer_name: "",
        customer_email: "",
        agent_id: "",
      })
    } catch (error) {
      console.error("Error creating conversation:", error)
    }
  }

  /**
   * Sends a message
   * @param {string} message - Message content
   */
  const handleSendMessage = async (message) => {
    if (!activeConversation || !activeConversation.agent_id) return

    setIsSending(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId: activeConversation.id,
          agentId: activeConversation.agent_id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      await fetchConversations() // Update conversation list
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader title="Conversations" subtitle="Loading..." />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Conversations" subtitle="Real-time AI-powered customer conversations" />

      <main className="p-6 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversation?.id}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {showNewConversationForm ? (
              <Card className="border-border h-full">
                <CardHeader>
                  <CardTitle className="text-foreground">New Conversation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newConversationData.title}
                      onChange={(e) => setNewConversationData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Conversation title"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name" className="text-foreground">
                        Customer Name
                      </Label>
                      <Input
                        id="customer_name"
                        value={newConversationData.customer_name}
                        onChange={(e) => setNewConversationData((prev) => ({ ...prev, customer_name: e.target.value }))}
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
                        type="email"
                        value={newConversationData.customer_email}
                        onChange={(e) =>
                          setNewConversationData((prev) => ({ ...prev, customer_email: e.target.value }))
                        }
                        placeholder="john@example.com"
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent_id" className="text-foreground">
                      AI Agent
                    </Label>
                    <select
                      id="agent_id"
                      value={newConversationData.agent_id}
                      onChange={(e) => setNewConversationData((prev) => ({ ...prev, agent_id: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select an agent</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={createConversation}
                      disabled={!newConversationData.title || !newConversationData.agent_id}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Create Conversation
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewConversationForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : activeConversation ? (
              <Card className="border-border h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground">{activeConversation.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {activeConversation.customer_name || activeConversation.customer_email}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        activeConversation.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {activeConversation.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isSending || !activeConversation.agent_id}
                    placeholder={
                      !activeConversation.agent_id
                        ? "No agent assigned to this conversation"
                        : isSending
                          ? "AI is responding..."
                          : "Type your message..."
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Select a Conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list or create a new one to start chatting.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
