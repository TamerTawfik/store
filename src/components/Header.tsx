"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { SearchInput } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  Package,
  ChevronDown,
  Store,
} from "lucide-react";

export const Header: React.FC = () => {
  const { cartState } = useCart();
  const { products } = useProducts();
  const { categories } = useCategories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo with Icon */}
            <Link
              href="/"
              className="flex items-center space-x-2 flex-shrink-0 group"
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  FakeStore
                </h1>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Premium Shopping
                </span>
              </div>
            </Link>

            {/* Enhanced Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                suggestions={suggestions}
                recentSearches={recentSearches}
                trendingSearches={trendingSearches}
                placeholder="Search for products, brands, categories..."
                className="w-full"
              />
            </div>

            {/* Enhanced Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200"
                >
                  Products
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200"
                >
                  Categories
                </Button>
              </Link>
            </nav>

            {/* Enhanced Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Wishlist Button - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>

              {/* Enhanced Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="relative text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                aria-label={`Shopping cart with ${cartState.itemCount} items`}
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                {cartState.itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                  >
                    {cartState.itemCount > 99 ? "99+" : cartState.itemCount}
                  </Badge>
                )}
              </Button>

              {/* Enhanced User Account Dropdown */}
              <div className="relative hidden md:block" data-user-menu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleUserMenu}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  aria-label="User account menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <User className="h-5 w-5" />
                  <ChevronDown
                    className={`h-3 w-3 ml-1 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Welcome!
                      </p>
                      <p className="text-xs text-gray-500">
                        Sign in to access your account
                      </p>
                    </div>

                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-4 w-4 mr-3" />
                        Sign In
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package className="h-4 w-4 mr-3" />
                        My Orders
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Heart className="h-4 w-4 mr-3" />
                        Wishlist
                      </button>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <p className="px-4 py-2 text-xs text-gray-500">
                        Coming soon: Full account features
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="lg:hidden text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Search Bar */}
          <div className="md:hidden px-4 pb-4 pt-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              suggestions={suggestions}
              recentSearches={recentSearches}
              trendingSearches={trendingSearches}
              placeholder="Search for products..."
              className="w-full"
            />
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Links */}
              <Link
                href="/"
                className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package className="h-5 w-5 mr-3" />
                Home
              </Link>
              <Link
                href="/products"
                className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Store className="h-5 w-5 mr-3" />
                Products
              </Link>
              <Link
                href="/categories"
                className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Menu className="h-5 w-5 mr-3" />
                Categories
              </Link>

              {/* Mobile-specific actions */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Future: Open wishlist
                  }}
                  className="flex items-center w-full px-3 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <Heart className="h-5 w-5 mr-3" />
                  Wishlist
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleCart();
                  }}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Cart
                  </div>
                  {cartState.itemCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {cartState.itemCount}
                    </Badge>
                  )}
                </button>
              </div>

              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">Account</p>
                  <p className="text-xs text-gray-500">
                    Sign in to access your account
                  </p>
                </div>
                <button className="flex items-center w-full px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">
                  <User className="h-5 w-5 mr-3" />
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
