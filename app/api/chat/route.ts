import { NextResponse } from "next/server"

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(req: Request) {
  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "DeepSeek API key is not configured" }, { status: 500 })
  }

  const { message } = await req.json()

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-reasoner",
        messages: [{ role: "user", content: message }],
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from DeepSeek API")
    }

    const data = await response.json()
    return NextResponse.json({ message: data.choices[0].message.content })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
  }
}

