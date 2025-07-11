import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const logoUrl = new URL("/images/usdcme-logo.png", request.url).toString()

    return new ImageResponse(
      <img
        src={logoUrl || "/placeholder.svg"}
        alt="USDCme Logo"
        width={1024} // Ensure the image fills the entire 1024x1024 canvas
        height={1024}
        style={{ objectFit: "contain" }} // Use 'contain' to ensure the entire image is visible within the bounds
      />,
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
