"use client";

import React, { Suspense } from "react";
import { Header } from "@/components/Header";
import { CartProvider } from "@/components/cart/CartProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Suspense
        fallback={<div className="h-16 bg-white border-b animate-pulse" />}
      >
        <Header />
      </Suspense>
      <section>{children}</section>
    </CartProvider>
  );
}
