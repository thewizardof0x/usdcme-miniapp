import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // This line is crucial for global styles

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "USDCme - Experimental Circular Tipping",
  description: "What goes around comes around - experimental USDC tipping app",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/image`,
      button: {
        title: "🔄 USDCme",
        action: {
          type: "launch_miniapp",
          name: "USDCme",
          url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
          splashImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/splash`,
          splashBackgroundColor: "#f8fffe",
        },
      },
    }),
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/image`,
      button: {
        title: "🔄 USDCme",
        action: {
          type: "launch_frame",
          name: "USDCme",
          url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
          splashImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/splash`,
          splashBackgroundColor: "#f8fffe",
        },
      },
    }),
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
