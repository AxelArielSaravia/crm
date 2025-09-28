/**
 * @fileoverview Chat message bubble component
 * @type-check
 */

/**
 * Message bubble component
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data
 * @param {boolean} [props.isTyping] - Whether message is being typed
 * @returns {JSX.Element} Message bubble component
 */
export function MessageBubble({ message, isTyping = false }) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">{message.content}</div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className="flex items-start gap-3 max-w-[80%]">
        {!isUser && (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm text-primary-foreground">🤖</span>
          </div>
        )}

        <div
          className={`px-4 py-2 rounded-lg ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {isTyping && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          )}
          <div className="text-xs opacity-70 mt-1">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {isUser && (
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm text-secondary-foreground">👤</span>
          </div>
        )}
      </div>
    </div>
  )
}
