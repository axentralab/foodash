"use client";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from "@/lib/utils";

export default function AdminOrdersPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-100">Orders</h1>
        <p className="text-gray-400 text-sm">{MOCK_ORDERS.length} total orders</p>
      </div>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Order ID","Items","Total","Status","Date","Action"].map(h=>(
                <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map(order=>(
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-xs text-dark-100">#{order.id.slice(-9).toUpperCase()}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{order.items.length} items</td>
                <td className="py-3 px-4 font-bold text-dark-100 text-sm">{formatPrice(order.total_price)}</td>
                <td className="py-3 px-4">
                  <span className={`badge border text-xs ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-400">{formatDate(order.created_at)}</td>
                <td className="py-3 px-4">
                  <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:border-primary">
                    {["pending","confirmed","preparing","ready","picked_up","delivered","cancelled"].map(s=>(
                      <option key={s} value={s} selected={s===order.status}>{s.replace("_"," ")}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
