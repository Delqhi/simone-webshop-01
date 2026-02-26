'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatToggleButton } from '@/components/ai/ChatToggleButton'
import { ChatWindow } from '@/components/ai/ChatWindow'
import { useUIStore } from '@/lib/store'
import type { ChatMessage } from '@/types'

export function AIChatWidget() {
  const { isChatOpen, toggleChat, closeChat } = useUIStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((message) => ({ role: message.role, content: message.content })),
        }),
      })
      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message || 'Entschuldigung, ich konnte keine Antwort generieren.',
          timestamp: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ChatToggleButton isOpen={isChatOpen} onClick={toggleChat} />
      {isChatOpen ? (
        <ChatWindow
          messages={messages}
          input={input}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          onInputChange={setInput}
          onSend={sendMessage}
          onClose={closeChat}
        />
      ) : null}
    </>
  )
}
