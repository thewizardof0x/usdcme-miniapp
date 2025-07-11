"use client"

import { useEffect, useState } from "react"
import { Wallet } from "lucide-react"
import { useAccount, useConnect } from "wagmi"
import { config } from "./Web3Provider"
import { sdk } from "@farcaster/miniapp-sdk"
import type { Context } from "@farcaster/miniapp-sdk"

export function FarcasterConnect() {
  const { isConnected, address } = useAccount()
  const { connect } = useConnect()
  const [context, setContext] = useState<Context.MiniAppContext | null>(null)

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const context = await sdk.context
        console.log(context, "context")
        setContext(context)
      } catch (error) {
        console.error("Failed to fetch context:", error)
      }
    }
    fetchContext()
  }, [])

  return (
    <div className="farcaster-connect">
      {isConnected && address ? (
        <div
          className="flex items-center gap-2 rounded-full px-3 py-2 max-w-[140px]"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            boxShadow: "0 8px 32px rgba(112, 167, 210, 0.15)",
          }}
        >
          {context?.user.pfpUrl && (
            <img src={context.user.pfpUrl || "/placeholder.svg"} alt="avatar" className="w-4 h-4 rounded-full" />
          )}
          <span className="text-usdc-blue font-medium text-sm truncate">
            {context?.user.username || `${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: config.connectors[0] })}
          className="button button-primary flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          <span className="text-sm">Connect Farcaster</span>
        </button>
      )}
    </div>
  )
}
