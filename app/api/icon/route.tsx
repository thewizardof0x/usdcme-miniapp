import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const logoUrl = new URL("/images/usdcme-logo.png", request.url).toString()
    // The blue color from the provided icon image
    const iconBlue = "#4A90E2"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconBlue, // Set background to the blue of the icon
          borderRadius: "100px", // Rounded corners for the overall icon shape
        }}
      >
        <img
          src={logoUrl || "/placeholder.svg"}
          alt="USDCme Logo"
          width={800} // Adjust size to fill the icon canvas appropriately
          height={800}
          style={{ borderRadius: "0px" }} // The source image already has rounding, so no additional rounding needed here
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
