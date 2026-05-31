"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, ArrowLeft, CheckCircle2, CreditCard } from "lucide-react";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/payment-methods";
import { cn } from "@/lib/utils";

interface PurchaseFormProps {
  drawId: string;
  tokenPrice: number;
  maxTokens: number;
  title: string;
}

type Step = "quantity" | "payment" | "confirm" | "done";

export default function PurchaseForm({
  drawId,
  tokenPrice,
  maxTokens,
  title,
}: PurchaseFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("quantity");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [tokenNumbers, setTokenNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = tokenPrice * quantity;
  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  const handleInitiatePayment = async () => {
    if (!paymentMethod) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tokens/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawId, quantity, paymentMethod }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth/login?redirect=/draw/${drawId}`);
          return;
        }
        throw new Error(data.error || "Failed to initiate payment");
      }

      setPaymentId(data.paymentId);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentId || !paymentMethod) return;

    if (paymentMethod === "bank_card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setError("Please enter a valid 16-digit card number");
        return;
      }
    } else if (transactionRef.trim().length < 4) {
      setError("Please enter your transaction / reference ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/payments/${paymentId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionRef: paymentMethod === "bank_card"
            ? `CARD-${cardNumber.slice(-4)}`
            : transactionRef.trim(),
          payerPhone: payerPhone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment confirmation failed");

      setTokenNumbers(data.tokenNumbers);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="rounded-3xl bg-[#111] p-6 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-green-400" size={48} />
        <h3 className="mb-2 text-xl font-bold text-white">Payment Successful!</h3>
        <p className="mb-4 text-sm text-muted">Your tickets have been issued:</p>
        <div className="mb-6 space-y-2">
          {tokenNumbers.map((num) => (
            <div key={num} className="rounded-xl bg-black px-4 py-2 font-mono text-pink">
              {num}
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/dashboard/tickets")}
          className="w-full rounded-full bg-blue py-3 font-bold text-white hover:bg-blue/80"
        >
          VIEW MY TICKETS
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#111] p-6">
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-2 text-xs">
        {(["quantity", "payment", "confirm"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full font-bold",
                step === s || (step === "confirm" && s !== "quantity" && i <= 1)
                  ? "bg-pink text-white"
                  : "bg-border text-muted"
              )}
            >
              {i + 1}
            </span>
            <span className={step === s ? "text-white" : "text-muted"}>
              {s === "quantity" ? "Tickets" : s === "payment" ? "Pay" : "Confirm"}
            </span>
            {i < 2 && <span className="text-border">→</span>}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red/10 p-3 text-center text-sm text-red">{error}</div>
      )}

      {/* Step 1: Quantity */}
      {step === "quantity" && (
        <>
          <div className="mb-4 text-center">
            <span className="text-2xl font-bold text-pink">{formatCurrency(tokenPrice)}</span>
            <span className="text-sm text-muted"> per token</span>
          </div>
          <div className="mb-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white hover:border-pink"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-2xl font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(maxTokens, quantity + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white hover:border-pink"
              disabled={quantity >= maxTokens}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="mb-6 text-center text-sm text-muted">
            Total: <span className="font-bold text-white">{formatCurrency(total)}</span>
            {" · "}{maxTokens} tokens remaining
          </div>
          <button
            onClick={() => setStep("payment")}
            disabled={maxTokens === 0}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue py-4 text-sm font-black text-white hover:bg-blue/80 disabled:opacity-50"
          >
            CONTINUE TO PAYMENT
          </button>
        </>
      )}

      {/* Step 2: Payment method */}
      {step === "payment" && (
        <>
          <p className="mb-4 text-center text-sm text-muted">
            Pay <span className="font-bold text-white">{formatCurrency(total)}</span> via:
          </p>
          <div className="mb-4 space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
                  paymentMethod === method.id
                    ? "border-pink bg-pink/10"
                    : "border-border hover:border-white/30"
                )}
              >
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <div className="font-bold text-white">{method.name}</div>
                  <div className="text-xs text-muted">{method.description}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep("quantity")}
              className="flex items-center gap-1 rounded-full border border-border px-4 py-3 text-sm text-muted hover:text-white"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={handleInitiatePayment}
              disabled={!paymentMethod || loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue py-3 text-sm font-black text-white hover:bg-blue/80 disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              {loading ? "PROCESSING..." : "PROCEED TO PAY"}
            </button>
          </div>
        </>
      )}

      {/* Step 3: Confirm payment */}
      {step === "confirm" && selectedMethod && (
        <>
          <div
            className="mb-4 rounded-xl border p-4"
            style={{ borderColor: selectedMethod.color + "44" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">{selectedMethod.icon}</span>
              <span className="font-bold text-white">{selectedMethod.name}</span>
            </div>
            <div className="mb-3 text-2xl font-black text-pink">{formatCurrency(total)}</div>

            {selectedMethod.accountNumber && (
              <div className="mb-3 rounded-lg bg-black p-3 text-sm">
                <div className="text-muted">Send to:</div>
                <div className="font-bold text-white">{selectedMethod.accountTitle}</div>
                <div className="font-mono text-pink">{selectedMethod.accountNumber}</div>
              </div>
            )}

            <ol className="space-y-1 text-xs text-muted">
              {selectedMethod.instructions.map((inst, i) => (
                <li key={i}>{i + 1}. {inst}</li>
              ))}
            </ol>
          </div>

          {paymentMethod === "bank_card" ? (
            <div className="mb-4">
              <label className="mb-1 flex items-center gap-2 text-sm text-muted">
                <CreditCard size={14} /> Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl border border-border bg-black px-4 py-3 font-mono text-white outline-none focus:border-pink"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="mb-1 block text-sm text-muted">Transaction / Reference ID *</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. EP1234567890"
                className="w-full rounded-xl border border-border bg-black px-4 py-3 text-white outline-none focus:border-pink"
              />
            </div>
          )}

          {(paymentMethod === "easypaisa" || paymentMethod === "jazzcash") && (
            <div className="mb-4">
              <label className="mb-1 block text-sm text-muted">Your Mobile Number</label>
              <input
                type="tel"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="w-full rounded-xl border border-border bg-black px-4 py-3 text-white outline-none focus:border-pink"
              />
            </div>
          )}

          <p className="mb-4 text-center text-xs text-yellow">
            ⚠️ Tickets will be issued ONLY after payment is confirmed
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => { setStep("payment"); setError(""); }}
              className="flex items-center gap-1 rounded-full border border-border px-4 py-3 text-sm text-muted hover:text-white"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-sm font-black text-white hover:bg-green-500 disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "I HAVE PAID — GET TICKETS"}
            </button>
          </div>
        </>
      )}

      <p className="mt-3 text-center text-xs text-muted">Entering: {title}</p>
    </div>
  );
}
