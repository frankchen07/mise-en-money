import { NextResponse } from "next/server"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

export const runtime = "nodejs"
export const maxDuration = 60 // Set maximum runtime to 60 seconds (maximum allowed for hobby plan)

export async function POST(req: Request) {
  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "DeepSeek API key is not configured" }, { status: 500 })
  }

  try {
    const { message, stream = true } = await req.json()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000) // 55 second timeout

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-reasoner",
        messages: [{ role: "user", content: message }],
        stream: stream,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DeepSeek API error:", errorText)
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    if (stream) {
      const reader = response.body?.getReader()
      const encoder = new TextEncoder()

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = new TextDecoder().decode(value)
                const lines = chunk.split("\n")

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    const data = line.slice(6)
                    if (data === "[DONE]") {
                      controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                      continue
                    }
                    try {
                      const parsed = JSON.parse(data)
                      const content = parsed.choices[0]?.delta?.content || ""
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                    } catch (e) {
                      console.error("Failed to parse chunk:", e)
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ error: "Failed to parse response" })}\n\n`),
                      )
                    }
                  }
                }
              }
              controller.close()
            } catch (error) {
              console.error("Stream processing error:", error)
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream processing error" })}\n\n`))
              controller.close()
            }
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        },
      )
    } else {
      const data = await response.json()
      return NextResponse.json({ message: data.choices[0].message.content })
    }
  } catch (error) {
    console.error("Error:", error)
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 })
    }
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
  }
}

