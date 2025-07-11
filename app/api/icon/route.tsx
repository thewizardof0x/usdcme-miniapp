import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#282860", // Solid dark blue background
          borderRadius: "150px", // Rounded corners for the square icon
        }}
      >
        {/* No content needed inside, as it's a solid color icon */}
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
