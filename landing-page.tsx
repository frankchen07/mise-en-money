import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

      setStatus('success')
      setEmail("")
    } catch (error) {
      console.error('Subscription error:', error)
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Mise en Money</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 max-w-[600px] mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Mise en Money
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  I help service workers master their money mindset, automate their finances, and live their best lives. Sign up and get an actionable 5-day plan to take control of your finances.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="flex-1"
                />
                <Button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'Send me the plan'}
                </Button>
              </form>
              {status === 'success' && (
                <p className="text-green-600">Thank you! The plan will be sent to your email shortly.</p>
              )}
              {status === 'error' && (
                <p className="text-red-600">An error occurred. Please try again later.</p>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 max-w-[600px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Need extra help?</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Personal finances can be a DIY thing, but having extra help can be beneficial for accountability, speeding up savings growth, or really getting out of debt. Let's have a chat to see if it's a good fit for us!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <Button size="lg" variant="outline" asChild>
                  <Link href="/chat">Chat with Mise Bot</Link>
                </Button> */}
                <Button size="lg" asChild>
                  <Link href="https://docs.google.com/forms/d/1IMIf2SPaB2SHVlUQ_K8I6vritWAkJoxyKQAgR0NgOHs/edit">
                    Tell me about yourself
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Mise en Money. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

