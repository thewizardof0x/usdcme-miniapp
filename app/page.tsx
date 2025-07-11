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
        // FIXED: Simplified auto-connect with better error handling
        if (!isConnected) {
          try {
            const { config } = await import("@/components/Web3Provider")
            if (config.connectors && config.connectors.length > 0) {
              connect({ connector: config.connectors[0] })
            }
          } catch (error) {
            console.log("Auto-connect failed, user can connect manually:", error)
          }
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
      <USDCStep
        isCompleted={false}
        isEnabled={isConnected}
        onComplete={handleStepComplete}
        executionId={selectedExecutionId}
      />

      {/* Execution History */}
      <ExecutionHistory
        refreshTrigger={refreshTrigger}
        onExecutionSelect={setSelectedExecutionId}
      />
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
