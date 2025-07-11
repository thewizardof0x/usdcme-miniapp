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
          background: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)", // Keeping original dark background for icon.ico
          borderRadius: "200px",
        }}
      >
        <img
          src={logoUrl || "/placeholder.svg"}
          alt="USDCme Logo"
          width={400}
          height={400}
          style={{ borderRadius: "40px" }}
        />
      </div>,
      {
        width: 1024,
        height: 1024,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
