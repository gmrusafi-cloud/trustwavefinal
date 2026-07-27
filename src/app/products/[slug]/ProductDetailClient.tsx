"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  badge: string | null;
  inStock: boolean | null;
  rating: number;
  reviewCount: number | null;
  specs: Record<string, string>;
  categoryName: string | null;
  categorySlug: string | null;
}

interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean | null;
  createdAt: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  badge: string | null;
  rating: number;
  reviewCount: number;
  categoryName: string | null;
}

interface Props {
  product: Product;
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}

export default function ProductDetailClient({ product, reviews, relatedProducts }: Props) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [reviewForm, setReviewForm] = useState({ author: "", rating: 5, title: "", body: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, ...reviewForm }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setLocalReviews([{ ...newReview, createdAt: new Date().toISOString() }, ...localReviews]);
        setReviewForm({ author: "", rating: 5, title: "", body: "" });
      }
    } catch {
      // ignore
    }
    setSubmittingReview(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
        {product.categoryName && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.categorySlug}`} className="hover:text-brand-600 transition-colors">
              {product.categoryName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-sm">
            <Image
              src={product.images[selectedImage] || ""}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-4 py-1.5 bg-brand-600 text-white text-sm font-semibold rounded-full shadow-lg">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === i
                      ? "border-brand-600 shadow-lg shadow-brand-500/20"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.categoryName && (
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="text-sm font-semibold text-brand-600 uppercase tracking-wider hover:text-brand-700 transition-colors"
            >
              {product.categoryName}
            </Link>
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <StarRating rating={product.rating} size="md" showValue />
            <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          <p className="text-gray-600 leading-relaxed mb-8 line-clamp-3">
            {product.description}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center bg-gray-100 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 text-lg font-medium"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 text-lg font-medium"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0] || "",
                  quantity,
                  slug: product.slug,
                });
                setQuantity(1);
              }}
              className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart — {formatPrice(product.price * quantity)}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
            {[
              { icon: "🚚", label: "Free Shipping" },
              { icon: "🔒", label: "Secure Payment" },
              { icon: "🔄", label: "Easy Return" },
            ].map((b) => (
              <div key={b.label} className="text-center">
                <div className="text-xl mb-1">{b.icon}</div>
                <div className="text-xs font-medium text-gray-600">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-brand-600 border-brand-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab === "reviews" ? `Reviews (${localReviews.length})` : tab === "specs" ? "Specifications" : "Description"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-16">
        {activeTab === "description" && (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex items-center px-6 py-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <span className="w-48 text-sm font-semibold text-gray-700">{key}</span>
                  <span className="text-sm text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Review Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating.toFixed(1)}</div>
                  <StarRating rating={product.rating} size="lg" />
                  <p className="text-sm text-gray-500 mt-2">Based on {localReviews.length} reviews</p>
                </div>

                {/* Write a review */}
                <form onSubmit={handleReviewSubmit} className="space-y-3 border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 text-sm">Write a Review</h3>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`text-xl ${
                            star <= reviewForm.rating ? "text-amber-400" : "text-gray-200"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Review title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <textarea
                    placeholder="Write your review..."
                    rows={3}
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {localReviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium mb-1">No reviews yet</p>
                  <p className="text-sm">Be the first to review this product!</p>
                </div>
              ) : (
                localReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{review.author}</span>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full flex items-center gap-1">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-gray-900 text-sm mt-2">{review.title}</h4>
                    )}
                    {review.body && (
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.body}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                image={p.image}
                badge={p.badge}
                rating={p.rating}
                reviewCount={p.reviewCount}
                categoryName={p.categoryName ?? undefined}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
