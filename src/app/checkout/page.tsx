"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import LocationSelector from "@/components/checkout/LocationSelector";
import { validateShippingAddress, ValidationResult } from "@/lib/address-validator";
import { CheckCircle2, AlertTriangle, Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "Dhaka",
    postalCode: "1200",
    paymentMethod: "cod",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Real-time address validation derived value
  const validation = validateShippingAddress(form.shippingAddress, form.city, form.postalCode, subtotal);

  const shipping = validation.shippingFee;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          subtotal,
          shipping,
          total,
        }),
      });
      if (res.ok) {
        const order = await res.json();
        setOrderId(order.id);
        setOrderPlaced(true);
        clearCart();
      }
    } catch {
      // ignore
    }
    setSubmitting(false);
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-2">Thank you for shopping with TRUSTWAVE BD</p>
        <p className="text-sm text-gray-400 mb-8">
          Order #{orderId} has been confirmed. You&apos;ll receive a confirmation email shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="px-8 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some products to proceed to checkout</p>
        <Link
          href="/products"
          className="px-8 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-700">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Contact Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Shipping Address & Delivery Zone
                </h2>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${validation.badgeColor}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {validation.zoneName}
                </span>
              </div>

              {/* Location Selector Component */}
              <LocationSelector
                currentAddress={form.shippingAddress}
                currentCity={form.city}
                currentPostalCode={form.postalCode}
                onSelectLocation={({ address, city, postalCode }) => {
                  setForm((prev) => ({
                    ...prev,
                    shippingAddress: address || prev.shippingAddress,
                    city: city || prev.city,
                    postalCode: postalCode !== undefined ? postalCode : prev.postalCode,
                  }));
                }}
              />

              {/* Real-time Address Validation Status Card */}
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {validation.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                        Real-Time Delivery Area Status:
                        <span className="font-extrabold text-brand-700">{validation.zoneName}</span>
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{validation.message}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-gray-900 block">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-extrabold">FREE SHIPPING</span>
                      ) : (
                        `Shipping Fee: ${formatPrice(shipping)}`
                      )}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center justify-end gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-brand-600" />
                      Est. Delivery: {validation.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {validation.suggestions && validation.suggestions.length > 0 && (
                  <div className="border-t border-gray-200/60 pt-2 text-[11px] text-gray-500 flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-700">Tips for fast delivery:</span>
                    {validation.suggestions.map((tip, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border border-gray-200">
                        • {tip}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={form.shippingAddress}
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                    placeholder="House/Flat no., Road, Block/Area (e.g. House #12, Road #4, Dhanmondi)"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City / District *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Dhaka, Chittagong, Sylhet, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="1200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive" },
                  { value: "bkash", label: "bKash", icon: "📱", desc: "Mobile payment" },
                  { value: "card", label: "Credit/Debit Card", icon: "💳", desc: "Visa, Mastercard" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === method.value
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{method.label}</span>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      form.paymentMethod === method.value
                        ? "border-brand-600 bg-brand-600"
                        : "border-gray-300"
                    }`}>
                      {form.paymentMethod === method.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                "Processing..."
              ) : (
                <>
                  Place Order — {formatPrice(total)}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm items-start">
                <div>
                  <span className="text-gray-500 block">Shipping Zone</span>
                  <span className="text-[11px] font-semibold text-brand-700 block mt-0.5">
                    📍 {validation.zoneName}
                  </span>
                </div>
                <span className={`font-medium ${shipping === 0 ? "text-emerald-600 font-extrabold" : ""}`}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-gray-500 pt-1">
                <span>Est. Delivery Time:</span>
                <span className="font-semibold text-gray-800">{validation.estimatedDelivery}</span>
              </div>

              {shipping === 0 && (
                <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-1.5 font-medium border border-emerald-100">
                  🎉 Free shipping unlocked for this location!
                </p>
              )}

              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
