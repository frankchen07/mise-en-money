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

    // Handle streaming response
    if (stream) {
      const stream = response.body
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    // Handle non-streaming response
    const data = await response.json()
    return NextResponse.json({ message: data.choices[0].message.content })
  } catch (error) {
    console.error("Error:", error)
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 })
    }
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
  }
}

