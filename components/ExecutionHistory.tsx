"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ExternalLink, Users, Wallet, DollarSign } from "lucide-react"
import { useAccount } from "wagmi"

const TRAIL_ID = "0197604c-f761-7ade-8a5c-5e50c2d834d4"
const VERSION_ID = "0197604c-f76a-779a-8f2e-e3ba236da2c6"

interface Execution {
  id: string
  createdAt: string
  updatedAt: string
  steps: Array<{
    stepNumber: number
    nodeId: string
    txHash: string
    createdAt: string
  }>
}

interface ExecutionData {
  executions: Execution[]
  farcasterData?: {
    username: string
    pfp_url: string
    display_name: string
    fid: string
    bio: string
    followers: number
    following: number
  }
}

interface ExecutionHistoryProps {
  onExecutionSelect?: (executionId: string) => void
  selectedExecutionId?: string
  onRefresh?: () => void
}

export function ExecutionHistory({ onExecutionSelect, selectedExecutionId, onRefresh }: ExecutionHistoryProps) {
  const [userExecutions, setUserExecutions] = useState<ExecutionData | null>(null)
  const [communityExecutions, setCommunityExecutions] = useState<Record<string, ExecutionData>>({})
  const [totals, setTotals] = useState({ transactions: 0, wallets: 0 })
  const [loading, setLoading] = useState(true)
  const { address } = useAccount()
  const [openExecutionId, setOpenExecutionId] = useState<string | null>(null) // State to manage open collapsible

  const fetchExecutions = async () => {
    if (!address) return

    try {
      // Fetch user's executions
      const userResponse = await fetch(
        `https://trails-api.herd.eco/v1/trails/${TRAIL_ID}/versions/${VERSION_ID}/executions/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddresses: [address.toLowerCase()],
          }),
        },
      )

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserExecutions(userData.executions[address.toLowerCase()] || null)
      }

      // Fetch community executions
      const communityResponse = await fetch(
        `https://trails-api.herd.eco/v1/trails/${TRAIL_ID}/versions/${VERSION_ID}/executions/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddresses: [],
          }),
        },
      )

      if (communityResponse.ok) {
        const communityData = await communityResponse.json()
        setCommunityExecutions(communityData.executions)
        setTotals(communityData.totals)
      }
    } catch (error) {
      console.error("Failed to fetch executions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExecutions()
  }, [address])

  useEffect(() => {
    if (onRefresh) {
      fetchExecutions()
    }
  }, [onRefresh])

  const formatTxHash = (hash: string) => {
    if (hash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      return "Skipped"
    }
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const getValidSteps = (steps: any[]) => {
    return steps.filter((step) => step.stepNumber > 0)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div
          style={{ height: "128px", backgroundColor: "#f3f4f6", animation: "pulse 2s infinite", borderRadius: "8px" }}
        ></div>
        <div
          style={{ height: "192px", backgroundColor: "#f3f4f6", animation: "pulse 2s infinite", borderRadius: "8px" }}
        ></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User's Executions */}
      <div className="card">
        <div className="card-header">
          <Wallet className="w-5 h-5 text-usdc-blue" />
          <div className="card-title">Your Transaction History</div>
        </div>
        <div className="card-description">Your previous USDC transactions</div>
        <div className="card-content">
          {!userExecutions || userExecutions.executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet!</p>
              <p className="text-sm">Be the first to test USDCme</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userExecutions.executions.map((execution) => {
                const validSteps = getValidSteps(execution.steps)
                const isOpen = openExecutionId === execution.id
                return (
                  <div key={execution.id} className="collapsible-item">
                    <button
                      onClick={() => setOpenExecutionId(isOpen ? null : execution.id)}
                      className="button button-ghost w-full justify-between p-3"
                      style={{ height: "auto" }}
                    >
                      <div className="flex items-center gap-3">
                        <ChevronRight
                          className="w-4 h-4"
                          style={{
                            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease-out",
                          }}
                        />
                        <div style={{ textAlign: "left" }}>
                          <div className="font-medium">Execution {execution.id.slice(0, 8)}...</div>
                          <div className="text-sm text-muted-foreground">
                            {validSteps.length} transaction{validSteps.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedExecutionId === execution.id && (
                          <span className="badge badge-secondary">Selected</span>
                        )}
                        <span className="badge badge-outline">
                          {new Date(execution.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                    <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
                      <div className="space-y-2" style={{ marginLeft: "28px" }}>
                        {validSteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="flex items-center justify-between p-2"
                            style={{ backgroundColor: "rgba(0,0,0,0.03)", borderRadius: "4px" }}
                          >
                            <span className="text-sm">Step {step.stepNumber}</span>
                            <a
                              href={`https://herd.eco/base/tx/${step.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-usdc-blue"
                              style={{ textDecoration: "none" }}
                            >
                              {formatTxHash(step.txHash)}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                        {onExecutionSelect && (
                          <button
                            className="button button-outline w-full mt-2"
                            onClick={() => onExecutionSelect(execution.id)}
                          >
                            {selectedExecutionId === execution.id ? "Selected" : "Select Execution"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Community Stats */}
      <div className="card">
        <div className="card-header">
          <Users className="w-5 h-5 text-usdc-blue" />
          <div className="card-title">Community Activity</div>
        </div>
        <div className="card-description">See who else is testing (derivatives of) USDCme</div>
        <div className="card-content">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--usdc-blue-light)" }}>
              <div className="text-2xl font-bold text-usdc-blue">{totals.transactions}</div>
              <div className="text-sm text-muted-foreground">Total Tips</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--usdc-blue-light)" }}>
              <div className="text-2xl font-bold text-usdc-blue">{totals.wallets}</div>
              <div className="text-sm text-muted-foreground">Testers</div>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Object.entries(communityExecutions)
              .filter(([walletAddress]) => walletAddress !== address?.toLowerCase())
              .slice(0, 10)
              .map(([walletAddress, data]) => {
                const totalTxs = data.executions.reduce((acc, exec) => acc + getValidSteps(exec.steps).length, 0)

                return (
                  <div
                    key={walletAddress}
                    className="flex items-center gap-3 p-2 rounded"
                    style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                  >
                    {data.farcasterData?.pfp_url ? (
                      <img
                        src={data.farcasterData.pfp_url || "/placeholder.svg"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(to bottom, var(--usdc-blue-dark) 0%, var(--usdc-blue-dark) 100%)",
                        }}
                      >
                        <span className="text-white text-xs">{walletAddress.slice(2, 4).toUpperCase()}</span>
                      </div>
                    )}
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div className="font-medium text-sm truncate">
                        {data.farcasterData?.username ? (
                          <a
                            href={`https://farcaster.xyz/${data.farcasterData.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            @{data.farcasterData.username}
                          </a>
                        ) : (
                          <a
                            href={`https://herd.eco/base/wallet/${walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {totalTxs} tips{totalTxs !== 1 ? "" : ""} sent
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
