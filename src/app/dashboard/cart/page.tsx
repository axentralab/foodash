"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { CartItem } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

function CartItemRow({ item }: { item: CartItem }) {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {!imgErr ? (
          <Image src={item.menu_item.image_url} alt={item.menu_item.name} fill className="object-cover" onError={()=>setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-dark-100 text-sm leading-tight truncate">{item.menu_item.name}</h3>
        <p className="text-primary font-bold text-base mt-0.5">{formatPrice(item.menu_item.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={()=>decreaseQty(item.id)}
            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 font-bold text-lg leading-none">−</button>
          <span className="w-6 text-center font-bold text-dark-100 text-sm">{item.quantity}</span>
          <button onClick={()=>increaseQty(item.id)}
            className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all active:scale-90 font-bold text-lg leading-none">+</button>
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
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const delivery = subtotal > 0 ? 5.00 : 0;
  const discount = promoApplied ? 5.00 : 0.50;
  const total = subtotal + delivery - discount;

  const applyPromo = () => {
    if (promo.toUpperCase() === "FOODASH") {
      setPromoApplied(true); setPromoError("");
    } else { setPromoError("Invalid promo code"); }
  };

  const placeOrder = async () => {
    setOrdering(true);
    await new Promise(r => setTimeout(r, 1500));
    clearCart(); setOrdered(true); setOrdering(false);
  };

  if (ordered) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-10 text-center">
        <div className="text-8xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-dark-100 mb-2">Order Placed!</h2>
        <p className="text-gray-400 mb-8">Your food is being prepared. Track it in Orders.</p>
        <div className="flex gap-3">
          <Link href="/dashboard/orders" className="btn-primary px-8 py-3">Track Order</Link>
          <Link href="/dashboard/menu" className="btn-ghost px-8 py-3">Order More</Link>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-10 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-dark-100 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some delicious items to get started!</p>
        <Link href="/dashboard/menu" className="btn-primary flex items-center gap-2 px-8 py-3">🍽️ Browse Menu</Link>
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
        <button onClick={()=>clearCart()} className="text-sm text-gray-400 hover:text-red-400 transition-colors font-semibold">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Items */}
        <div className="lg:col-span-3 space-y-3">
          {items.map(item => <CartItemRow key={item.id} item={item} />)}
          <Link href="/dashboard/menu" className="block text-sm text-primary font-semibold mt-2 hover:underline">+ Add more items</Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Promo */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-semibold text-dark-100 mb-3">🏷️ Promo Code</h3>
            <div className="flex gap-2">
              <input type="text" value={promo} onChange={e=>{setPromo(e.target.value);setPromoError("");}}
                placeholder="Try: FOODASH"
                className="input-field flex-1 py-2.5 text-sm" disabled={promoApplied} />
              <button onClick={applyPromo} disabled={promoApplied}
                className={cn("px-4 py-2.5 rounded-xl font-semibold text-sm transition-all",
                  promoApplied?"bg-green-100 text-green-600 cursor-default":"bg-primary text-white hover:bg-primary-dark")}>
                {promoApplied?"✓ Applied":"Apply"}
              </button>
            </div>
            {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
            {promoApplied && <p className="text-green-600 text-xs mt-2">🎉 $5 discount applied!</p>}
          </div>

          {/* Payment summary */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-bold text-dark-100 text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3">
              {[
                {label:`Subtotal (${totalItems} items)`, val:formatPrice(subtotal)},
                {label:"Delivery Fee", val:formatPrice(delivery)},
                {label:"Discount", val:`- ${formatPrice(discount)}`, cls:"text-green-600"},
              ].map(({label,val,cls})=>(
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className={cn("font-semibold text-dark-100", cls)}>{val}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-dark-100">Total</span>
                <span className="font-bold text-xl text-dark-100">{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={placeOrder} disabled={ordering}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-5 py-4">
              {ordering
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/>
                : "Place Order →"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure payment • Free cancellation within 5 min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
