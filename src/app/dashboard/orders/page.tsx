"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel, getOrderStatusStep, cn } from "@/lib/utils";

const STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "ready", label: "Ready", icon: "📦" },
  { key: "picked_up", label: "On the Way", icon: "🛵" },
  { key: "delivered", label: "Delivered", icon: "🏠" },
];

function OrderTracker({ status }: { status: OrderStatus }) {
  const currentStep = getOrderStatusStep(status);
  return (
    <div className="py-4">
      <div className="flex items-start justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200" />
        {/* Progress line */}
        <div className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-700"
          style={{ width: `${(Math.max(0, currentStep - 1) / (STEPS.length - 1)) * 90}%` }} />
        {STEPS.map((step, i) => {
          const done = currentStep >= i + 1;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-base border-2 transition-all duration-500",
                done ? "border-primary bg-orange-50 shadow-md shadow-orange-100" : "border-gray-200 bg-white")}>
                {done ? step.icon : <span className="w-2 h-2 rounded-full bg-gray-300 block"/>}
              </div>
              <span className={cn("text-[10px] font-semibold text-center leading-tight max-w-[52px]",
                done ? "text-primary" : "text-gray-300")}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(!["delivered","cancelled"].includes(order.status));
  const [imgErrs, setImgErrs] = useState<Record<string,boolean>>({});
  const isActive = !["delivered","cancelled"].includes(order.status);

  return (
    <div className={cn("bg-white rounded-3xl shadow-card overflow-hidden", isActive && "ring-2 ring-orange-200")}>
      {/* Header */}
      <div className="p-5 cursor-pointer" onClick={()=>setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-dark-100">#{order.id.slice(-9).toUpperCase()}</span>
              {isActive && <span className="flex items-center gap-1 text-xs text-primary font-semibold"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"/>Live</span>}
            </div>
            <p className="text-gray-400 text-xs">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("badge border text-xs", getOrderStatusColor(order.status))}>{getOrderStatusLabel(order.status)}</span>
            <span className="text-gray-400 text-sm">{expanded?"▲":"▼"}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center -space-x-2">
            {order.items.slice(0,3).map((item,i)=>(
              <div key={item.id} className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white" style={{zIndex:3-i}}>
                {!imgErrs[item.id] ? (
                  <Image src={item.menu_item_image} alt={item.menu_item_name} width={36} height={36}
                    className="object-cover w-full h-full" onError={()=>setImgErrs(p=>({...p,[item.id]:true}))} />
                ) : <div className="w-full h-full bg-orange-50 flex items-center justify-center text-lg">🍽️</div>}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-9 h-9 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-400">+{order.items.length-3}</div>
            )}
          </div>
          <span className="font-bold text-dark-100 text-lg">{formatPrice(order.total_price)}</span>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-5 space-y-5">
          {/* Tracker */}
          {order.status !== "cancelled" && (
            <div>
              <h4 className="font-semibold text-dark-100 text-sm mb-1 flex items-center gap-2">
                ⏱ Order Progress
                {order.estimated_delivery && (
                  <span className="ml-auto text-xs text-gray-400 font-normal">
                    ETA {new Date(order.estimated_delivery).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                  </span>
                )}
              </h4>
              <OrderTracker status={order.status} />
            </div>
          )}

          {/* Items list */}
          <div>
            <h4 className="font-semibold text-dark-100 text-sm mb-3">Items Ordered</h4>
            <div className="space-y-2">
              {order.items.map(item=>(
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {!imgErrs[`d${item.id}`] ? (
                      <Image src={item.menu_item_image} alt={item.menu_item_name} fill className="object-cover"
                        onError={()=>setImgErrs(p=>({...p,[`d${item.id}`]:true}))} />
                    ) : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>}
                  </div>
                  <span className="flex-1 text-sm text-dark-200 font-medium">{item.menu_item_name}</span>
                  <span className="text-xs text-gray-400">x{item.quantity}</span>
                  <span className="text-sm font-semibold text-dark-100">{formatPrice(item.price*item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-surface rounded-2xl p-4 space-y-2">
            {[
              {label:"Subtotal", val:formatPrice(order.total_price-order.delivery_fee+order.discount)},
              {label:"Delivery", val:formatPrice(order.delivery_fee)},
              {label:"Discount", val:`- ${formatPrice(order.discount)}`, cls:"text-green-600"},
            ].map(({label,val,cls})=>(
              <div key={label} className="flex justify-between text-xs">
                <span className="text-gray-400">{label}</span>
                <span className={cn("font-semibold text-dark-200", cls)}>{val}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-bold text-dark-100 text-sm">Total</span>
              <span className="font-bold text-dark-100">{formatPrice(order.total_price)}</span>
            </div>
          </div>

          {/* Rider */}
          {order.rider && order.status !== "delivered" && (
            <div className="flex items-center gap-3 bg-orange-50 rounded-2xl p-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-2xl">🛵</div>
              <div className="flex-1">
                <p className="font-semibold text-dark-100 text-sm">{order.rider.name}</p>
                <p className="text-xs text-gray-400">★ {order.rider.rating} rating</p>
              </div>
              <a href={`tel:${order.rider.phone}`}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-lg shadow-primary">📞</a>
            </div>
          )}

          {/* Delivery address */}
          <p className="text-xs text-gray-400 flex items-start gap-1.5">
            <span>📍</span> {order.delivery_address}
          </p>

          {/* Reorder */}
          {order.status === "delivered" && (
            <Link href="/dashboard/menu"
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm">
              🔄 Reorder
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const active = MOCK_ORDERS.filter(o=>!["delivered","cancelled"].includes(o.status));
  const past = MOCK_ORDERS.filter(o=>["delivered","cancelled"].includes(o.status));

  return (
    <div className="min-h-full p-5 lg:p-10 max-w-3xl mx-auto pb-28">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-100">My Orders</h1>
        <p className="text-gray-400 text-sm">{MOCK_ORDERS.length} total orders</p>
      </div>

      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"/>Active Orders
          </h2>
          <div className="space-y-4">{active.map(o=><OrderCard key={o.id} order={o}/>)}</div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Past Orders</h2>
          <div className="space-y-4">{past.map(o=><OrderCard key={o.id} order={o}/>)}</div>
        </section>
      )}
    </div>
  );
}
