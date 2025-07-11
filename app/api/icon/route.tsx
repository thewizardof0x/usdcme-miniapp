import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // The blue color from your provided icon image
    const iconBlue = "#4A90E2"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconBlue, // Set background to the exact blue of your icon
          borderRadius: "100px", // Rounded corners for the overall icon shape
        }}
      >
        <div
          style={{
            fontSize: "600px", // Make the emoji large to fill the icon space
            lineHeight: "1",
          }}
        >
          🔄
        </div>
      </div>,
      {
        width: 1024,
        height: 1024,
      },
    )
  } catch (e: any) {
    console.log(`Error generating icon: ${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
