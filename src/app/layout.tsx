import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FooDash — Deliver Deliciousness",
  description: "Order your favorite food, delivered fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
