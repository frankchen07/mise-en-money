"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function ChatPage() {
  const [streamingEnabled, setStreamingEnabled] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef]) // Updated dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setError(null)
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    const sendRequest = async (retryCount = 0) => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, stream: streamingEnabled }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (streamingEnabled) {
          const reader = response.body?.getReader()
          const decoder = new TextDecoder()
          let assistantMessage = ""

          if (reader) {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value)
              const lines = chunk.split("\n")

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6)
                  if (data === "[DONE]") continue
                  try {
                    const parsed = JSON.parse(data)
                    const content = parsed.choices[0]?.delta?.content || ""
                    assistantMessage += content
                    setMessages((prev) => {
                      const newMessages = [...prev]
                      const lastMessage = newMessages[newMessages.length - 1]
                      if (lastMessage?.role === "assistant") {
                        lastMessage.content = assistantMessage
                      } else {
                        newMessages.push({ role: "assistant", content: assistantMessage })
                      }
                      return newMessages
                    })
                  } catch (e) {
                    console.error("Failed to parse chunk:", e)
                  }
                }
              }
            }
          }
        } else {
          const data = await response.json()
          setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
        }
      } catch (error) {
        console.error("Error:", error)
        if (retryCount < 3) {
          console.log(`Retrying... (${retryCount + 1})`)
          await sendRequest(retryCount + 1)
        } else {
          setError("Failed to get a response. Please try again.")
        }
      }
    }

    await sendRequest()
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 dark:text-white hover:opacity-80 transition-opacity"
          >
            <span className="sr-only">Back to Home</span>
            &larr;
          </Link>
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-2 text-blue-500"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat with Mise Bot
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Streaming</span>
            <Switch
              checked={streamingEnabled}
              onCheckedChange={setStreamingEnabled}
              aria-label="Toggle streaming mode"
            />
          </div>
        </div>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="container mx-auto max-w-2xl">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 animate-pulse">
                Mise Bot is thinking...
              </span>
            </div>
          )}
          {error && <div className="text-center text-red-500 mt-4">{error}</div>}
        </div>
      </ScrollArea>
      <footer className="p-4 border-t bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="container mx-auto max-w-2xl">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </div>
        </form>
      </footer>
    </div>
  )
}

