"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 tracking-tight">TRUSTWAVE</span>
              <span className="text-xl font-bold text-brand-600 tracking-tight ml-1">BD</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              All Products
            </Link>
            <Link href="/products?category=electronics" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=smartphones" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Smartphones
            </Link>
            <Link href="/products?category=gaming" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Gaming
            </Link>
            <Link href="/products?category=jerseys" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Jerseys
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Search (desktop) */}
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search products...
            </Link>

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "All Products" },
                { href: "/products?category=electronics", label: "Electronics" },
                { href: "/products?category=smartphones", label: "Smartphones" },
                { href: "/products?category=audio", label: "Audio" },
                { href: "/products?category=wearables", label: "Wearables" },
                { href: "/products?category=gaming", label: "Gaming" },
                { href: "/products?category=jerseys", label: "Jerseys" },
                { href: "/products?category=photography", label: "Photography" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
