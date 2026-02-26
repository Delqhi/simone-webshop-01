import { RefObject } from 'react'
import type { ChatMessage } from '@/types'

interface ChatWindowProps {
  messages: ChatMessage[]
  input: string
  isLoading: boolean
  messagesEndRef: RefObject<HTMLDivElement>
  onInputChange: (value: string) => void
  onSend: () => void
  onClose: () => void
}

export function ChatWindow({
  messages,
  input,
  isLoading,
  messagesEndRef,
  onInputChange,
  onSend,
  onClose,
}: ChatWindowProps) {
  return (
    <div className="animate-slide-up fixed bottom-24 right-6 z-40 flex h-[500px] max-h-[calc(100vh-8rem)] w-96 max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-2xl shadow-[rgba(31,42,50,0.16)]">
      <div className="flex items-center justify-between border-b border-brand-border bg-brand-surface-strong px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-text">KI-Assistent</h3>
            <p className="text-xs text-brand-text-muted">Antwortet in wenigen Sekunden</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-1 text-brand-text-muted transition-colors hover:text-brand-text">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-bg-muted">
              <svg className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="mb-2 font-medium text-brand-text">Hallo</h4>
            <p className="text-sm text-brand-text-muted">Ich helfe bei Produkten, Bestellungen und Versandfragen.</p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={[
                'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                message.role === 'user'
                  ? 'rounded-br-md bg-brand-accent text-white'
                  : 'rounded-bl-md border border-brand-border bg-brand-surface-strong text-brand-text',
              ].join(' ')}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-brand-border bg-brand-surface-strong px-4 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-text-muted" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-text-muted" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-text-muted" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-brand-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => (event.key === 'Enter' ? onSend() : null)}
            placeholder="Schreibe eine Nachricht..."
            className="flex-1 rounded-lg border border-brand-border bg-white px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-[rgba(31,140,114,0.2)]"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="rounded-lg bg-brand-accent px-4 py-2 text-white transition-colors hover:bg-[color:var(--brand-accent-strong)] disabled:cursor-not-allowed disabled:bg-brand-border"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
