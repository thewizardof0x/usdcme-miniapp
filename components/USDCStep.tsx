"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowRightLeft, Send, Loader2 } from "lucide-react"
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi"
import { base } from "wagmi/chains"
import Image from "next/image"

const TRAIL_ID = "0197604c-f761-7ade-8a5c-5e50c2d834d4"
const VERSION_ID = "0197604c-f76a-779a-8f2e-e3ba236da2c6"
const PRIMARY_NODE_ID = "0197604e-691f-7386-85a3-addc4346d6d0"

// NEW: Address replacement configuration
const YOUR_WALLET_ADDRESS = "0xD9D4F5D67C91c8Ba6A216503A359fD9518FC15D3" // thewizardof0x.eth
const HERD_WALLET_ADDRESS = "0x2Ae8c972fB2E6c00ddED8986E2dc672ED190DA06" // herd.eth address

interface USDCStepProps {
  isCompleted: boolean
  isEnabled: boolean
  onComplete: () => void
  executionId?: string
}

const PRESET_AMOUNTS = ["1", "5", "10", "25"]

export function USDCStep({ isCompleted, isEnabled, onComplete, executionId }: USDCStepProps) {
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { address, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  // Switch to Base chain
  useEffect(() => {
    if (isConnected) {
      switchChain({ chainId: base.id })
    }
  }, [switchChain, address, isConnected])

  const {
    sendTransaction,
    isPending,
    error: txError,
  } = useSendTransaction({
    mutation: {
      onSuccess: async (hash: string) => {
        console.log("Transaction successfully sent:", hash)
        
        // MODIFIED: Updated success message to reflect new recipient
        console.log("USDC Sent to thewizardof0x.eth! 🔄 What goes around comes around!")
        onComplete()
        
        // OPTIONAL: Still post to herd's API for tracking (but money goes to you)
        try {
          const response = await fetch(
            `https://trails-api.herd.eco/v1/trails/${TRAIL_ID}/versions/${VERSION_ID}/executions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nodeId: PRIMARY_NODE_ID,
                transactionHash: hash,
                walletAddress: address!,
                execution: { type: "latest" },
              }),
            },
          )
          // Don't throw on failure - this is just for their tracking
          if (response.ok) {
            console.log("Also logged to herd's system for tracking")
          }
        } catch (err) {
          console.log("Herd API tracking failed (but your transaction succeeded!)")
        }
      },
      onError: (error: Error) => {
        console.error("Transaction failed:", error)
        console.error(`Transaction failed: ${error.message}`)
      },
    },
  })

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or whole numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value)
    }
  }

  // MODIFIED: Hybrid approach - use herd's API but replace recipient address
  const handleSubmit = async () => {
    const parsedAmount = Number.parseInt(amount, 10)

    if (!parsedAmount || parsedAmount <= 0 || !Number.isInteger(parsedAmount)) {
      console.error("Invalid Amount: Please enter a whole number greater than 0.")
      return
    }

    if (!address || !isConnected) {
      console.error("Wallet Not Connected: Please connect your Farcaster wallet to send USDC.")
      return
    }

    setIsSubmitting(true)

    try {
      // STEP 1: Call herd's API to get the transaction structure (same as before)
      const evaluationResponse = await fetch(
        `https://trails-api.herd.eco/v1/trails/${TRAIL_ID}/versions/${VERSION_ID}/steps/1/evaluations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: address,
            userInputs: {
              [PRIMARY_NODE_ID]: {
                "inputs.value": {
                  value: parsedAmount.toString(),
                },
              },
            },
            execution: { type: "latest" },
          }),
        },
      )

      if (!evaluationResponse.ok) {
        throw new Error("Failed to get evaluation data")
      }

      const evaluation = await evaluationResponse.json()

      // STEP 2: Modify the recipient in the transaction data
      let modifiedCallData = evaluation.callData as string
      
      // Convert addresses to the format used in calldata (remove 0x, pad to 64 chars, lowercase)
      const herdAddressInCalldata = HERD_WALLET_ADDRESS.slice(2).toLowerCase().padStart(64, '0')
      const yourAddressInCalldata = YOUR_WALLET_ADDRESS.slice(2).toLowerCase().padStart(64, '0')
      
      // Replace herd's address with yours in the transaction calldata
      modifiedCallData = modifiedCallData.replace(herdAddressInCalldata, yourAddressInCalldata)
      
      console.log(`Modified transaction: USDC will go to thewizardof0x.eth instead of herd.eth`)

      // STEP 3: Create transaction with modified recipient
      const transactionRequest = {
        from: address as `0x${string}`,
        to: evaluation.contractAddress as `0x${string}`,
        data: modifiedCallData as `0x${string}`, // Using modified calldata with your address
        value: BigInt(evaluation.payableAmount ?? "0"),
      }

      // Send the modified transaction
      sendTransaction(transactionRequest)
      
    } catch (error) {
      console.error("Failed to prepare transaction:", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="card">
        <div className="card-header pb-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-usdc-blue" />
            <div className="card-title">USDC Sent! 🔄</div>
            <span className="badge badge-secondary ml-auto">Completed</span>
          </div>
          <div className="card-description">Ahh... the circle of USDC... Thanks for testing USDCme!</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`card ${!isEnabled ? "opacity-50" : ""}`}>
      <div className="card-header">
        <div className="flex items-center gap-3">
          <Image src="/images/usdcme-logo.png" alt="USDCme Logo" width={40} height={40} className="rounded-lg" />
          <div>
            <div className="card-title text-usdc-blue">Send USDC</div>
            <div className="card-description">(to thewizardof0x.eth)</div>
          </div>
        </div>
      </div>
      <div className="card-content space-y-4">
        {/* Preset Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              className="button button-outline"
              onClick={() => setAmount(preset)}
              disabled={!isEnabled || isSubmitting || isPending}
            >
              ${preset}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-usdc-blue">
            Custom Amount (USDC)
          </label>
          <input
            id="amount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1"
            value={amount}
            onChange={handleAmountChange}
            disabled={!isEnabled || isSubmitting || isPending}
            className="input text-lg"
            min="1"
          />
          <p className="text-xs text-muted-foreground">⚠️ Minimum: $1 USDC (whole numbers only)</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            !isEnabled ||
            !amount ||
            !isConnected ||
            isSubmitting ||
            isPending ||
            Number.parseInt(amount, 10) <= 0 ||
            !Number.isInteger(Number.parseInt(amount, 10))
          }
          className="button button-primary w-full"
        >
          {isSubmitting || isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending USDC...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send ${amount || "0"} USDC
            </>
          )}
        </button>

        {txError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">Error: {txError.message}</div>}
      </div>
    </div>
  )
}
