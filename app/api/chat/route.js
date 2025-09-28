/**
 * @fileoverview Chat API route for AI responses
 * @type-check
 */

import { createClient } from "../../../lib/supabase/server.js"
import { generateText } from "ai"

/**
 * Handles POST requests for chat messages
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response object
 */
export async function POST(request) {
  try {
    const { message, conversationId, agentId } = await request.json()

    const supabase = await createClient()

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get agent configuration
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("user_id", user.id)
      .single()

    if (agentError || !agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 })
    }

    // Save user message
    const { error: messageError } = await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        user_id: user.id,
        content: message,
        role: "user",
      },
    ])

    if (messageError) {
      return Response.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Get conversation history for context
    const { data: messages } = await supabase
      .from("messages")
      .select("content, role")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(20)

    // Prepare messages for AI
    const conversationHistory =
      messages?.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })) || []

    // Generate AI response
    const { text } = await generateText({
      model: agent.model || "openai/gpt-3.5-turbo",
      system: agent.system_prompt,
      messages: conversationHistory,
      temperature: agent.temperature || 0.7,
      maxTokens: agent.max_tokens || 1000,
    })

    // Save AI response
    const { error: responseError } = await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        user_id: user.id,
        content: text,
        role: "assistant",
      },
    ])

    if (responseError) {
      return Response.json({ error: "Failed to save AI response" }, { status: 500 })
    }

    // Update conversation timestamp
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    return Response.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
