/**
 * @fileoverview Chat input component
 * @type-check
 */

"use client"

import { useState, useRef } from "react"
import { Button } from "../ui/button.jsx"

/**
 * Chat input component
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Send message handler
 * @param {boolean} [props.disabled] - Whether input is disabled
 * @param {string} [props.placeholder] - Input placeholder
 * @returns {JSX.Element} Chat input component
 */
export function ChatInput({ onSendMessage, disabled = false, placeholder = "Type your message..." }) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef(null)

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  /**
   * Handles textarea input changes and auto-resize
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - Change event
   */
  const handleChange = (e) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  /**
   * Handles key press events
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4 bg-background border-t border-border">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          style={{ minHeight: "40px", maxHeight: "120px" }}
        />
      </div>
      <Button
        type="submit"
        disabled={disabled || !message.trim()}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
      >
        Send
      </Button>
    </form>
  )
}
