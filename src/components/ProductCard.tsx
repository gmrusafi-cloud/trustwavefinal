"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import StarRating from "./StarRating";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  badge?: string | null;
  rating: number;
  reviewCount: number;
  categoryName?: string;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  badge,
  rating,
  reviewCount,
  categoryName,
}: ProductCardProps) {
  const { addItem } = useCart();

  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-100 flex flex-col">
      {/* Image */}
      <Link href={`/products/${slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full shadow-lg">
            {badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{discount}%
          </span>
        )}
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({ id, name, price, image, quantity: 1, slug });
            }}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {categoryName && (
          <span className="text-xs font-medium text-brand-600 uppercase tracking-wider mb-1">
            {categoryName}
          </span>
        )}
        <Link href={`/products/${slug}`} className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2 mb-2">
          {name}
        </Link>
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={rating} size="sm" />
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
