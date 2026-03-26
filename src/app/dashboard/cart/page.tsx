"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { usePlaceOrder } from "@/hooks/useOrders";
import { CartItem } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import PaymentForm from "@/components/payment/PaymentForm";

function CartItemRow({ item }: { item: CartItem }) {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {!imgErr
          ? <Image src={item.menu_item.image_url} alt={item.menu_item.name} fill className="object-cover" onError={()=>setImgErr(true)}/>
          : <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-dark-100 text-sm leading-tight truncate">{item.menu_item.name}</h3>
        <p className="text-primary font-bold text-base mt-0.5">{formatPrice(item.menu_item.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={()=>decreaseQty(item.id)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 font-bold text-lg leading-none">−</button>
          <span className="w-6 text-center font-bold text-dark-100 text-sm">{item.quantity}</span>
          <button onClick={()=>increaseQty(item.id)} className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all active:scale-90 font-bold text-lg leading-none">+</button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-bold text-dark-100">{formatPrice(item.subtotal)}</span>
        <button onClick={()=>removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors text-xl">🗑</button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { placeOrder } = usePlaceOrder();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [address, setAddress] = useState("123 Main St, Narayanganj 1400");
  const [step, setStep] = useState<"cart" | "payment" | "done">("cart");

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const delivery = subtotal > 0 ? 5.0 : 0;
  const discount = promoApplied ? 5.0 : 0.5;
  const total = subtotal + delivery - discount;

  const applyPromo = () => {
    if (promo.toUpperCase() === "FOODASH") { setPromoApplied(true); setPromoError(""); }
    else setPromoError("Invalid promo code");
  };

  const handlePaymentSuccess = async () => {
    await placeOrder({ cartItems: items, delivery_address: address, promo_code: promoApplied ? "FOODASH" : undefined });
    clearCart();
    setStep("done");
  };

  if (step === "done") {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-10 text-center">
        <div className="text-8xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-dark-100 mb-2">Order Confirmed!</h2>
        <p className="text-gray-400 mb-2">Payment successful. Your food is being prepared!</p>
        <p className="text-gray-400 text-sm mb-8">Estimated delivery: ~40 minutes</p>
        <div className="flex gap-3">
          <Link href="/dashboard/orders" className="btn-primary px-8 py-3">📦 Track Order</Link>
          <Link href="/dashboard/menu" className="btn-ghost px-8 py-3">Order More</Link>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="min-h-full p-5 lg:p-10 max-w-lg mx-auto">
        <button onClick={()=>setStep("cart")} className="flex items-center gap-2 text-gray-400 hover:text-dark-100 transition-colors mb-6 text-sm font-semibold">
          ← Back to Cart
        </button>
        <h1 className="text-2xl font-bold text-dark-100 mb-6">Complete Payment</h1>
        <PaymentForm
          amount={total}
          orderDetails={{ itemCount: totalItems, deliveryFee: delivery, discount }}
          onSuccess={handlePaymentSuccess}
          onCancel={()=>setStep("cart")}
        />
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-10 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-dark-100 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some delicious items to get started!</p>
        <Link href="/dashboard/menu" className="btn-primary px-8 py-3">🍽️ Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-full p-5 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-dark-100">Your Cart</h1>
          <p className="text-gray-400 text-sm">{totalItems} item{totalItems!==1?"s":""}</p>
        </div>
        <button onClick={()=>clearCart()} className="text-sm text-gray-400 hover:text-red-400 font-semibold">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-3">
          {items.map(item=><CartItemRow key={item.id} item={item}/>)}
          <Link href="/dashboard/menu" className="block text-sm text-primary font-semibold mt-2 hover:underline">+ Add more items</Link>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {/* Delivery address */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-semibold text-dark-100 mb-3">📍 Delivery Address</h3>
            <textarea value={address} onChange={e=>setAddress(e.target.value)}
              className="input-field text-sm resize-none" rows={2} placeholder="Enter your delivery address"/>
          </div>

          {/* Promo */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-semibold text-dark-100 mb-3">🏷️ Promo Code</h3>
            <div className="flex gap-2">
              <input type="text" value={promo} onChange={e=>{setPromo(e.target.value);setPromoError("");}}
                placeholder="Try: FOODASH" className="input-field flex-1 py-2.5 text-sm" disabled={promoApplied}/>
              <button onClick={applyPromo} disabled={promoApplied}
                className={cn("px-4 py-2.5 rounded-xl font-semibold text-sm transition-all",
                  promoApplied?"bg-green-100 text-green-600 cursor-default":"bg-primary text-white hover:bg-primary-dark")}>
                {promoApplied?"✓":"Apply"}
              </button>
            </div>
            {promoError&&<p className="text-red-500 text-xs mt-2">{promoError}</p>}
            {promoApplied&&<p className="text-green-600 text-xs mt-2">🎉 $5 discount applied!</p>}
          </div>

          {/* Payment summary */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-bold text-dark-100 text-lg mb-4">Order Summary</h3>
            <div className="space-y-3">
              {[
                {label:`Subtotal (${totalItems} items)`,val:formatPrice(subtotal)},
                {label:"Delivery Fee",val:formatPrice(delivery)},
                {label:"Discount",val:`- ${formatPrice(discount)}`,cls:"text-green-600"},
              ].map(({label,val,cls})=>(
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className={cn("font-semibold text-dark-100",cls)}>{val}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-dark-100">Total</span>
                <span className="font-bold text-xl text-dark-100">{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={()=>setStep("payment")} disabled={!address.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-5 py-4 disabled:opacity-50">
              💳 Proceed to Payment
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">🔒 Secured by SSL • Card, Mobile Pay & Cash accepted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
