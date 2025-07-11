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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0f5f9 0%, #e0e8ed 50%, #f0f5f9 100%)", // Lighter background
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* USDCme Logo */}
          <img
            src={logoUrl || "/placeholder.svg"}
            alt="USDCme Logo"
            width={80}
            height={80}
            style={{ borderRadius: "12px", boxShadow: "0 8px 32px rgba(112, 167, 210, 0.3)" }}
          />
          <div style={{ color: "#70A7D2" }}>USDCme</div>
        </div>

        <div
          style={{
            fontSize: "18px",
            color: "#70A7D2",
            textAlign: "center",
            maxWidth: "400px",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          What goes around comes around
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#6B7280", // Darker grey for secondary text on light background
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          Experimental circular USDC tipping
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "32px",
            padding: "12px 24px",
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Opaque white on light background
            borderRadius: "50px",
            fontSize: "16px",
            color: "#70A7D2",
            border: "1px solid rgba(112, 167, 210, 0.2)",
          }}
        >
          <div
            style={{
              width: "40px" /* Increased size */,
              height: "40px" /* Increased size */,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #5A8BB0 0%, #456B85 50%, #304B5A 100%)", // New blue gradient
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px" /* Increased emoji size */,
              fontWeight: "bold",
            }}
          >
            🧙‍♂️
          </div>
          thewizardof0x
        </div>
      </div>,
      {
        width: 600,
        height: 400,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
