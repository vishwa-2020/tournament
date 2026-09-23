import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/Navigation"
import { MobileNavigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Volleyball Tournament - Live Scores",
  description: "Live volleyball tournament management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen pb-16 sm:pb-0">
          {children}
        </main>
        <MobileNavigation />
      </body>
    </html>
  )
}
