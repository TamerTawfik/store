"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { SearchInput } from "@/components/ui/search";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const { cartState } = useCart();
  const { products } = useProducts();
  const { categories } = useCategories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    recentSearches,
    trendingSearches,
    addToRecentSearches,
  } = useSearch({ products, categories });

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToRecentSearches(query);
      const params = new URLSearchParams(searchParams);
      params.set("search", query);
      router.push(`/?${params.toString()}`);
    }
  };

  // Initialize search query from URL params
  React.useEffect(() => {
    const searchFromUrl = searchParams.get("search") || searchParams.get("q");
    if (searchFromUrl && searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">FakeStore</h1>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                suggestions={suggestions}
                recentSearches={recentSearches}
                trendingSearches={trendingSearches}
                placeholder="Search products..."
                className="w-full"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Cart
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Shopping cart"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6 0a2 2 0 100 4 2 2 0 000-4zm-6 0a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden px-4 pb-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              suggestions={suggestions}
              recentSearches={recentSearches}
              trendingSearches={trendingSearches}
              placeholder="Search products..."
              className="w-full"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart ({cartState.itemCount})
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
