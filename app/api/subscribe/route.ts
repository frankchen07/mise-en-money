import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
  const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID

  if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
    console.error('MailerLite API key or Group ID is missing')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email,
        groups: [MAILERLITE_GROUP_ID]
      })
    })

    if (!response.ok) {
      throw new Error('Failed to subscribe')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('MailerLite API error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}

