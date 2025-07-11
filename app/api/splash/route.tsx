import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const logoUrl = new URL("/images/usdcme-logo.png", request.url).toString()

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0f5f9 0%, #e0e8ed 100%)", // Lighter background
          borderRadius: "20px",
        }}
      >
        <img
          src={logoUrl || "/placeholder.svg"}
          alt="USDCme Logo"
          width={120}
          height={120}
          style={{ borderRadius: "12px", boxShadow: "0 8px 32px rgba(112, 167, 210, 0.3)" }}
        />
      </div>,
      {
        width: 200,
        height: 200,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
