import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
    confirmed: "text-blue-600 bg-blue-50 border-blue-200",
    preparing: "text-orange-600 bg-orange-50 border-orange-200",
    ready: "text-purple-600 bg-purple-50 border-purple-200",
    picked_up: "text-indigo-600 bg-indigo-50 border-indigo-200",
    delivered: "text-green-600 bg-green-50 border-green-200",
    cancelled: "text-red-600 bg-red-50 border-red-200",
  };
  return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready for Pickup",
    picked_up: "On the Way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

export function getOrderStatusStep(status: string): number {
  const steps: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    ready: 3,
    picked_up: 4,
    delivered: 5,
  };
  return steps[status] ?? 0;
}
