"use client";

import { Header } from "@/components/Header";
import { CartProvider } from "@/components/cart/CartProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <section>{children}</section>
    </CartProvider>
  );
}
