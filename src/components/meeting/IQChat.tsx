'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowUp, RotateCcw } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface IQChatProps {
  itemId: string
  userRole: 'director' | 'executive'
}

const SUGGESTED_PROMPTS = [
  'What are the key risks not addressed in this paper?',
  'Compare this to the previous quarter\'s figures',
  'Summarise the main claims in 3 bullet points',
  'What questions should I prioritise?',
]

export function IQChat({ itemId, userRole }: IQChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const prevItemIdRef = useRef(itemId)

  // Clear messages when itemId changes
  useEffect(() => {
    if (prevItemIdRef.current !== itemId) {
      setMessages([])
      setInput('')
      setError(null)
      setIsStreaming(false)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      prevItemIdRef.current = itemId
    }
  }, [itemId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return

    setError(null)
    const userMessage: ChatMessage = { role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsStreaming(true)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch('/api/iq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          itemId,
          userRole,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Failed to connect to IQ.')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream available.')

      const decoder = new TextDecoder()
      let assistantContent = ''

      // Add empty assistant message to fill progressively
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantContent += chunk

        // Update the last message with accumulated content
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantContent,
          }
          return updated
        })
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      const errorMessage =
        err instanceof Error ? err.message : 'Unable to connect to IQ. Check your connection.'
      setError(errorMessage)
      // Remove the empty assistant message if it was added
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].content === '') {
          return prev.slice(0, -1)
        }
        return prev
      })
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [isStreaming, messages, itemId, userRole])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handlePromptClick(prompt: string) {
    sendMessage(prompt)
  }

  function handleRetry() {
    setError(null)
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
      if (lastUserMessage) {
        // Remove the failed message and retry
        setMessages((prev) => {
          const lastUserIdx = prev.findLastIndex((m) => m.role === 'user')
          return prev.slice(0, lastUserIdx)
        })
        sendMessage(lastUserMessage.content)
      }
    }
  }

  return (
    <div className="flex flex-col">
      {/* Message list */}
      <div className="flex-1 space-y-3 mb-3 max-h-[400px] overflow-y-auto">
        {messages.length === 0 && !isStreaming && (
          <div className="space-y-2">
            <p className="text-[12px] text-ink-muted mb-2">
              Ask IQ about this agenda item:
            </p>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="block w-full text-left text-ink-muted text-[12px] border border-border-light rounded-lg p-2 hover:border-ember cursor-pointer transition-colors duration-150"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div className="ml-12">
                <div className="bg-paper-dark rounded-lg p-3">
                  <p className="text-[13px] font-sans text-ink leading-[1.65]">
                    {msg.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mr-12">
                <p className="text-[13px] font-sans text-ink-secondary leading-[1.65] whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].content === '' && (
          <div className="mr-12">
            <div className="flex gap-1 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg border border-border-main bg-paper">
          <p className="text-[12px] text-ink-muted flex-1">{error}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 text-[11px] font-medium text-ember hover:text-ember-dark transition-colors duration-150"
          >
            <RotateCcw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask IQ a question..."
          disabled={isStreaming}
          className="flex-1 border border-border-main rounded-lg p-2.5 text-[13px] font-sans text-ink bg-paper placeholder:text-ink-faint focus:border-ember focus:outline-none transition-colors duration-150 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-ember text-white hover:bg-ember-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 self-center"
          aria-label="Send message"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>

      {/* Disclaimer */}
      <p className="text-[11px] text-ink-faint italic border-t border-border-light pt-2 mt-3">
        IQ analysis is AI-generated to support your preparation. It does not constitute professional advice.
      </p>
    </div>
  )
}
