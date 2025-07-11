"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect } from "wagmi"
import { sdk } from "@farcaster/miniapp-sdk"
import { Web3Provider } from "@/components/Web3Provider"
import { FarcasterConnect } from "@/components/FarcasterConnect"
import { USDCStep } from "@/components/USDCStep"
import { ExecutionHistory } from "@/components/ExecutionHistory"
import Image from "next/image"

function AppContent() {
  const [isAppReady, setIsAppReady] = useState(false)
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()

  // Auto-connect and mark app as ready
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Auto-connect to Farcaster
        if (!isConnected) {
          connect({ connector: (await import("@/components/Web3Provider")).config.connectors[0] })
        }

        // Mark app as ready for Farcaster
        await sdk.actions.ready()
        setIsAppReady(true)
        console.log("App marked as ready!")
      } catch (error) {
        console.error("Failed to initialize app:", error)
        setIsAppReady(true) // Still mark as ready to prevent infinite loading
      }
    }

    if (!isAppReady) {
      const timer = setTimeout(initializeApp, 100)
      return () => clearTimeout(timer)
    }
  }, [isAppReady, isConnected, connect])

  const handleStepComplete = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="flex items-center justify-center gap-3">
          <Image src="/images/usdcme-logo.png" alt="USDCme Logo" width={70} height={70} className="rounded-xl" />
          <div>
            <h1 className="text-2xl font-bold text-usdc-blue">USDCme</h1>
            <span className="badge badge-outline text-xs">EXPERIMENTAL</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-usdc-blue font-medium">what goes around comes around</p>
          <p className="text-sm text-muted-foreground">experimental USDC tipping</p>
        </div>
        <div className="flex justify-center">
          <FarcasterConnect />
        </div>
      </div>

      {/* Creator Info */}
      <div className="card">
        <div className="card-header pb-3">
          <div
            className="h-12"
            style={{
              background: "linear-gradient(to bottom, var(--usdc-blue-dark) 0%, var(--usdc-blue-dark) 100%)",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              width: "48px",
              lineHeight: "1.5rem",
              fontSize: "1.875rem",
            }}
          >
            🧙‍♂️
          </div>
          <div>
            <div className="card-title">{"@thewizardof0x"}</div>
            <div className="card-description flex items-center gap-1">
              thewizardof0x.eth
              <span className="badge badge-secondary text-xs">Testing</span>
            </div>
          </div>
        </div>
        <div className="card-content">
          <p className="text-sm text-muted-foreground">🧪 use at your own risk - this is a FC miniapp experiment 🧪 </p>
        </div>
      </div>

      {/* USDC Step */}
      {isConnected ? (
        <USDCStep
          isCompleted={false}
          isEnabled={true}
          onComplete={handleStepComplete}
          executionId={selectedExecutionId}
        />
      ) : (
        <div className="card opacity-50">
          <div className="card-content text-center py-8">
            <Image
              src="/images/usdcme-logo.png"
              alt="USDCme Logo"
              width={60}
              height={60}
              className="mx-auto mb-2 rounded-xl opacity-50"
            />
            <p className="text-muted-foreground">connect your wallet to tip me in USDC</p>
          </div>
        </div>
      )}

      {/* Execution History */}
      {isConnected && (
        <ExecutionHistory
          onExecutionSelect={setSelectedExecutionId}
          selectedExecutionId={selectedExecutionId}
          onRefresh={refreshTrigger > 0 ? () => {} : undefined}
        />
      )}

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 right-0"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderTop: "1px solid rgba(112, 167, 210, 0.2)",
          padding: "8px",
        }}
      >
        <div className="text-center">
          <a
            href="https://herd.eco/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-usdc-blue"
            style={{ textDecoration: "none" }}
          >
            Built with v0 and Powered by Herd
          </a>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  )
}
