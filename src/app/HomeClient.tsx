"use client";

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  badge: string | null;
  rating: number;
  reviewCount: number | null;
  categoryName: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface HomeClientProps {
  featuredProducts: Product[];
  categories: Category[];
  newArrivals: Product[];
}

const heroStats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "24/7", label: "Support" },
  { value: "Free", label: "Shipping 2K+" },
];

export default function HomeClient({ featuredProducts, categories, newArrivals }: HomeClientProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.2),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm text-brand-200 mb-6 border border-white/10">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                New Collection 2025 — Shop Now
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                Premium Tech &{" "}
                <span className="bg-gradient-to-r from-brand-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Lifestyle
                </span>{" "}
                Essentials
              </h1>
              <p className="text-lg text-brand-200/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Discover cutting-edge electronics, premium gadgets, sports jerseys, and more.
                Bangladesh&apos;s most trusted online store with fast delivery and unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-white text-brand-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 text-center"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/products?featured=true"
                  className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-center backdrop-blur-sm"
                >
                  Featured Deals ✨
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-brand-300/70 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Headphones"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Audio</span>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.pexels.com/photos/31541678/pexels-photo-31541678.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Smartwatch"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Wearables</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.pexels.com/photos/11120516/pexels-photo-11120516.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Smartphone"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Smartphones</span>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.pexels.com/photos/9660955/pexels-photo-9660955.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Camera"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Photography</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-brand-600 text-white py-2.5 overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-8 text-sm font-medium">
              🚚 Free Shipping on Orders Over ৳2,000 &nbsp;&nbsp;•&nbsp;&nbsp; 🔒 Secure Payments &nbsp;&nbsp;•&nbsp;&nbsp; 📦 Easy Returns &nbsp;&nbsp;•&nbsp;&nbsp; ⭐ 10,000+ Happy Customers
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Browse</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Shop by Category</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Find exactly what you&apos;re looking for across our curated collections
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-brand-200"
            >
              <div className="relative aspect-square">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <h3 className="text-sm font-semibold text-white text-center">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Curated</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Featured Products</h2>
              <p className="text-gray-500 mt-3">Handpicked by our team for quality and value</p>
            </div>
            <Link
              href="/products?featured=true"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                image={product.image}
                badge={product.badge}
                rating={product.rating}
                reviewCount={product.reviewCount ?? 0}
                categoryName={product.categoryName ?? undefined}
              />
            ))}
          </div>
          <div className="sm:hidden text-center mt-8">
            <Link
              href="/products?featured=true"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
            >
              View All Featured
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-purple-900 px-8 py-12 lg:px-16 lg:py-16">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-amber-400/20 text-amber-300 text-sm font-semibold rounded-full mb-4">
                🔥 Limited Time Offer
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Up to 25% Off on Selected Electronics
              </h2>
              <p className="text-brand-200/80 mb-8 max-w-md">
                Grab the latest gadgets at unbeatable prices. Offer valid while stocks last.
                Free shipping on all orders over ৳2,000.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
              >
                Shop the Sale
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative w-80 h-64">
                <Image
                  src="https://images.pexels.com/photos/5872176/pexels-photo-5872176.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  alt="Sale promo"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="320px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Fresh</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">New Arrivals</h2>
            <p className="text-gray-500 mt-3">Just in — the latest additions to our store</p>
          </div>
          <Link
            href="/products?sort=newest"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={product.image}
              badge={product.badge}
              rating={product.rating}
              reviewCount={product.reviewCount ?? 0}
              categoryName={product.categoryName ?? undefined}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On orders over ৳2,000" },
              { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
              { icon: "🔄", title: "Easy Returns", desc: "7-day return policy" },
              { icon: "💬", title: "24/7 Support", desc: "Dedicated help team" },
            ].map((badge) => (
              <div key={badge.title} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{badge.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
