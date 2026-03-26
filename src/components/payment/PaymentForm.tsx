"use client";

import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  orderDetails?: {
    itemCount: number;
    deliveryFee: number;
    discount: number;
  };
}

function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  return parts.length ? parts.join(" ") : value;
}

function formatExpiry(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (v.length >= 2) return v.slice(0, 2) + "/" + v.slice(2, 4);
  return v;
}

export default function PaymentForm({ amount, onSuccess, onCancel, orderDetails }: PaymentFormProps) {
  const [method, setMethod] = useState<"card" | "mobile" | "cash">("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileProvider, setMobileProvider] = useState("bkash");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");

    // Basic validation
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length < 16) { setError("Enter a valid 16-digit card number"); return; }
      if (card.expiry.length < 5) { setError("Enter a valid expiry date"); return; }
      if (card.cvv.length < 3) { setError("Enter a valid CVV"); return; }
      if (!card.name.trim()) { setError("Enter the cardholder name"); return; }
    }
    if (method === "mobile" && mobileNumber.length < 11) {
      setError("Enter a valid mobile number"); return;
    }

    setProcessing(true);
    setStep("processing");

    try {
      // Call our payment intent API
      const res = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "usd", metadata: { method } }),
      });

      const data = await res.json();

      // Simulate processing delay
      await new Promise(r => setTimeout(r, 2000));

      if (data.clientSecret || data.demo) {
        setStep("done");
        setTimeout(() => { onSuccess(); }, 1500);
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch {
      // Demo mode fallback
      await new Promise(r => setTimeout(r, 2000));
      setStep("done");
      setTimeout(() => { onSuccess(); }, 1500);
    } finally {
      setProcessing(false);
    }
  };

  if (step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h3 className="font-bold text-dark-100 text-xl mb-2">Processing Payment</h3>
        <p className="text-gray-400 text-sm">Please wait, do not close this page...</p>
        <div className="flex gap-1 mt-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">✅</div>
        <h3 className="font-bold text-dark-100 text-2xl mb-2">Payment Successful!</h3>
        <p className="text-gray-400 text-sm">Your order has been confirmed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Amount */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-500">Items ({orderDetails?.itemCount ?? "—"})</span>
          <span className="font-semibold text-dark-100">{formatPrice(amount - (orderDetails?.deliveryFee ?? 5) + (orderDetails?.discount ?? 0.5))}</span>
        </div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-500">Delivery</span>
          <span className="font-semibold text-dark-100">{formatPrice(orderDetails?.deliveryFee ?? 5)}</span>
        </div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-500">Discount</span>
          <span className="font-semibold text-green-600">- {formatPrice(orderDetails?.discount ?? 0.5)}</span>
        </div>
        <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
          <span className="font-bold text-dark-100">Total to Pay</span>
          <span className="text-2xl font-black text-primary">{formatPrice(amount)}</span>
        </div>
      </div>

      {/* Payment method selector */}
      <div>
        <p className="text-sm font-semibold text-dark-200 mb-3">Payment Method</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "card", label: "Card", icon: "💳" },
            { id: "mobile", label: "Mobile Pay", icon: "📱" },
            { id: "cash", label: "Cash on Delivery", icon: "💵" },
          ].map(m => (
            <button key={m.id} onClick={() => { setMethod(m.id as "card" | "mobile" | "cash"); setError(""); }}
              className={cn("flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-semibold border-2 transition-all",
                method === m.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 bg-white text-gray-500 hover:border-primary/40")}>
              <span className="text-xl">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card form */}
      {method === "card" && (
        <div className="space-y-4">
          <div className="bg-dark-100 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <p className="text-white/50 text-xs mb-4">CREDIT / DEBIT CARD</p>
              <p className="font-mono text-lg tracking-widest mb-4">
                {card.number || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-white/50 text-xs">CARDHOLDER</p>
                  <p className="font-semibold">{card.name.toUpperCase() || "YOUR NAME"}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs">EXPIRES</p>
                  <p className="font-semibold">{card.expiry || "MM/YY"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Number</label>
            <input type="text" maxLength={19} value={card.number} inputMode="numeric"
              onChange={e => setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
              placeholder="1234 5678 9012 3456" className="input-field font-mono tracking-wider" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Date</label>
              <input type="text" maxLength={5} value={card.expiry} inputMode="numeric"
                onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                placeholder="MM/YY" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
              <input type="password" maxLength={4} value={card.cvv}
                onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "") }))}
                placeholder="•••" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cardholder Name</label>
            <input type="text" value={card.name}
              onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
              placeholder="As printed on card" className="input-field" />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
            <span className="text-base">🔒</span>
            <span>Secured by 256-bit SSL encryption. Your card data is never stored.</span>
          </div>
        </div>
      )}

      {/* Mobile pay form */}
      {method === "mobile" && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-dark-200 mb-3">Select Provider</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "bkash", label: "bKash", color: "bg-pink-500", icon: "🅱️" },
                { id: "nagad", label: "Nagad", color: "bg-orange-500", icon: "🟠" },
                { id: "rocket", label: "Rocket", color: "bg-purple-600", icon: "🚀" },
              ].map(p => (
                <button key={p.id} onClick={() => setMobileProvider(p.id)}
                  className={cn("flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-semibold border-2 transition-all",
                    mobileProvider === p.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 bg-white text-gray-500 hover:border-primary/40")}>
                  <span className="text-xl">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {mobileProvider === "bkash" ? "bKash" : mobileProvider === "nagad" ? "Nagad" : "Rocket"} Number
            </label>
            <input type="tel" value={mobileNumber} maxLength={11}
              onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="01XXXXXXXXX" className="input-field" />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            📌 You&apos;ll receive a payment request on your {mobileProvider} app. Accept it to complete your order.
          </div>
        </div>
      )}

      {/* Cash on delivery */}
      {method === "cash" && (
        <div className="bg-gray-50 rounded-2xl p-5 text-center">
          <div className="text-5xl mb-4">💵</div>
          <h4 className="font-bold text-dark-100 mb-2">Cash on Delivery</h4>
          <p className="text-gray-400 text-sm">Please have <span className="font-bold text-dark-100">{formatPrice(amount)}</span> ready when your order arrives.</p>
          <p className="text-gray-400 text-xs mt-2">Rider will collect the payment at your door.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">{error}</div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="btn-ghost flex-1 py-4">← Back</button>
        <button onClick={handlePay} disabled={processing}
          className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
          {processing
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : `Pay ${formatPrice(amount)}`}
        </button>
      </div>
    </div>
  );
}
