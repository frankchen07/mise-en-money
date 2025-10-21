import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Mise en Money</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 max-w-[600px] mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  About Mise en Money
                </h1>
                <div className="space-y-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  <p>
                  Mise en Money is personal finance education systemized in a way that's easy to understand.
                  </p>
                  <p>
                  It’s a play off of “mise en place”, which means “everything in its place.” Chefs use it to ensure that everything they need for a hectic service is ready-to-go so they don’t end up in the weeds. We want this kind of organization for our finances.
                  </p>
                  <p>
                  When I look back at my own money journey, piecing together how to deal with my finances was lonely and stressful, and I wish I had better help.
                  </p>
                  <p>
                  <strong>Mise en Money aims to be that help.</strong>
                  </p>
                  <p>
                  My goal is to help folks have their money as organized as a chef does for their meez, so they can grow a nest egg, work towards their dreams, and get on with living their best life.
                  </p>
                </div>
              </div>
              {/* <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="https://docs.google.com/forms/d/1IMIf2SPaB2SHVlUQ_K8I6vritWAkJoxyKQAgR0NgOHs/edit">
                    Start Your Journey
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="https://misemoney.substack.com/">
                    Read My Blog
                  </Link>
                </Button>
              </div> */}
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

