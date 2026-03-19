"use client";

import { useEffect, useRef } from "react";
import { Order } from "@/types";

type CleanupRef = {
  cleanup: () => void;
} | null;

/**
 * useRealtimeOrder — subscribes to live order status changes via Supabase Realtime.
 * Falls back gracefully if Supabase is not configured.
 */
export function useRealtimeOrder(
  orderId: string | null,
  onUpdate: (order: Partial<Order>) => void
) {
  const cleanupRef = useRef<CleanupRef>(null);

  useEffect(() => {
    if (!orderId) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) return;

    let mounted = true;

    const setup = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const channel = (supabase as any)
          .channel(`order-${orderId}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "orders",
              filter: `id=eq.${orderId}`,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (payload: any) => {
              if (mounted) {
                onUpdate(payload.new as Partial<Order>);
              }
            }
          )
          .subscribe();

        cleanupRef.current = {
          cleanup: () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase as any).removeChannel(channel);
          },
        };
      } catch {
        // Supabase Realtime not available — fail silently
      }
    };

    setup();

    return () => {
      mounted = false;
      cleanupRef.current?.cleanup();
    };
  }, [orderId, onUpdate]);
}
