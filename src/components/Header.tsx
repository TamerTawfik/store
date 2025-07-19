"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useCartUI } from "@/components/cart/CartProvider";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
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
import {
  generateAriaLabel,
  keyboardHandlers,
  focusManagement,
  screenReader,
  ariaStates,
} from "@/utils/accessibility";

export const Header: React.FC = () => {
  const { cartState } = useCart();
  const { toggleCart } = useCartUI();
  const { products } = useProducts();
  const { categories } = useCategories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs for focus management
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    recentSearches,
    trendingSearches,
    addToRecentSearches,
  } = useSearch({ products, categories });

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Announce state change to screen readers
    screenReader.announceToScreenReader(
      newState ? "Mobile menu opened" : "Mobile menu closed"
    );

    // Focus management
    if (newState) {
      // Focus first link in mobile menu when opened
      setTimeout(() => {
        const firstLink = mobileMenuRef.current?.querySelector("a");
        firstLink?.focus();
      }, 100);
    } else {
      // Return focus to toggle button when closed
      mobileMenuButtonRef.current?.focus();
    }
  };

  const toggleUserMenu = () => {
    const newState = !isUserMenuOpen;
    setIsUserMenuOpen(newState);

    // Announce state change to screen readers
    screenReader.announceToScreenReader(
      newState ? "User menu opened" : "User menu closed"
    );

    // Focus management
    if (newState) {
      // Focus first button in user menu when opened
      setTimeout(() => {
        const firstButton = userMenuRef.current?.querySelector("button");
        firstButton?.focus();
      }, 100);
    } else {
      // Return focus to toggle button when closed
      userMenuButtonRef.current?.focus();
    }
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
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="skip-link"
        onFocus={(e) => (e.currentTarget.style.top = "6px")}
        onBlur={(e) => (e.currentTarget.style.top = "-40px")}
      >
        Skip to main content
      </a>

      <header
        className="shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo with Icon */}
            <Link
              href="/"
              className="flex items-center space-x-2 flex-shrink-0 group focus-ring"
              aria-label="FakeStore - Premium Shopping, go to homepage"
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200">
                <Store className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  FakeStore
                </h1>
                <span
                  className="text-xs text-gray-500 hidden sm:block"
                  aria-hidden="true"
                >
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
            <nav
              className="hidden lg:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 focus-ring"
                  aria-label="Go to home page"
                >
                  <Package className="h-4 w-4 mr-2" aria-hidden="true" />
                  Home
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 focus-ring"
                  aria-label="Browse all products"
                >
                  Products
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 focus-ring"
                  aria-label="Browse product categories"
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
                className="relative text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group focus-ring"
                aria-label={generateAriaLabel.cartButton(cartState.itemCount)}
                aria-describedby={
                  cartState.itemCount > 0 ? "cart-count" : undefined
                }
              >
                <ShoppingCart
                  className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"
                  aria-hidden="true"
                />
                {cartState.itemCount > 0 && (
                  <Badge
                    id="cart-count"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                    aria-label={`${cartState.itemCount} items in cart`}
                  >
                    {cartState.itemCount > 99 ? "99+" : cartState.itemCount}
                  </Badge>
                )}
              </Button>

              {/* Enhanced User Account Dropdown */}
              <div className="relative hidden md:block" data-user-menu>
                <Button
                  ref={userMenuButtonRef}
                  variant="ghost"
                  size="icon"
                  onClick={toggleUserMenu}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-ring"
                  aria-label="User account menu"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  aria-controls="user-menu"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                  <ChevronDown
                    className={`h-3 w-3 ml-1 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    ref={userMenuRef}
                    id="user-menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                    role="menu"
                    aria-labelledby="user-menu-button"
                  >
                    <div
                      className="px-4 py-3 border-b border-gray-100"
                      role="presentation"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        Welcome!
                      </p>
                      <p className="text-xs text-gray-500">
                        Sign in to access your account
                      </p>
                    </div>

                    <div
                      className="py-1"
                      role="group"
                      aria-label="Account actions"
                    >
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-ring"
                        role="menuitem"
                        aria-label="Sign in to your account"
                      >
                        <User className="h-4 w-4 mr-3" aria-hidden="true" />
                        Sign In
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-ring"
                        role="menuitem"
                        aria-label="View your orders"
                      >
                        <Package className="h-4 w-4 mr-3" aria-hidden="true" />
                        My Orders
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-ring"
                        role="menuitem"
                        aria-label="View your wishlist"
                      >
                        <Heart className="h-4 w-4 mr-3" aria-hidden="true" />
                        Wishlist
                      </button>
                    </div>

                    <div
                      className="border-t border-gray-100 py-1"
                      role="presentation"
                    >
                      <p
                        className="px-4 py-2 text-xs text-gray-500"
                        aria-hidden="true"
                      >
                        Coming soon: Full account features
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Mobile menu button */}
              <Button
                ref={mobileMenuButtonRef}
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="lg:hidden text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-ring"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                aria-haspopup="true"
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
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
          <nav
            ref={mobileMenuRef}
            id="mobile-menu"
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-200"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Links */}
              <Link
                href="/"
                className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Go to home page"
              >
                <Package className="h-5 w-5 mr-3" aria-hidden="true" />
                Home
              </Link>
              <Link
                href="/products"
                className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Browse all products"
              >
                <Store className="h-5 w-5 mr-3" aria-hidden="true" />
                Products
              </Link>
              <Link
                href="/categories"
                className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Browse product categories"
              >
                <Menu className="h-5 w-5 mr-3" aria-hidden="true" />
                Categories
              </Link>

              {/* Mobile-specific actions */}
              <div
                className="border-t border-gray-200 pt-4 mt-4"
                role="group"
                aria-label="Shopping actions"
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Future: Open wishlist
                  }}
                  className="flex items-center w-full px-3 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium focus-ring"
                  aria-label="View your wishlist"
                >
                  <Heart className="h-5 w-5 mr-3" aria-hidden="true" />
                  Wishlist
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleCart();
                  }}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus-ring"
                  aria-label={generateAriaLabel.cartButton(cartState.itemCount)}
                >
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-3" aria-hidden="true" />
                    Cart
                  </div>
                  {cartState.itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2"
                      aria-hidden="true"
                    >
                      {cartState.itemCount}
                    </Badge>
                  )}
                </button>
              </div>

              {/* Mobile User Section */}
              <div
                className="border-t border-gray-200 pt-4 mt-4"
                role="group"
                aria-label="Account actions"
              >
                <div className="px-3 py-2" role="presentation">
                  <p className="text-sm font-medium text-gray-900">Account</p>
                  <p className="text-xs text-gray-500">
                    Sign in to access your account
                  </p>
                </div>
                <button
                  className="flex items-center w-full px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus-ring"
                  aria-label="Sign in to your account"
                >
                  <User className="h-5 w-5 mr-3" aria-hidden="true" />
                  Sign In
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};
