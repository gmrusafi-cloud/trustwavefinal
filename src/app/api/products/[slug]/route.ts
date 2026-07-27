import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES, FALLBACK_REVIEWS } from "@/db/fallback-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (db) {
    try {
      const result = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          description: products.description,
          price: products.price,
          compareAtPrice: products.compareAtPrice,
          images: products.images,
          badge: products.badge,
          featured: products.featured,
          inStock: products.inStock,
          rating: products.rating,
          reviewCount: products.reviewCount,
          specs: products.specs,
          categoryId: products.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.slug, slug))
        .limit(1);

      if (result.length > 0) {
        const product = result[0];
        const productReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.productId, product.id))
          .orderBy(desc(reviews.createdAt));

        return NextResponse.json({ ...product, reviews: productReviews });
      }
    } catch (e) {
      console.error("Database query error in product detail API:", e);
    }
  }

  // Fallback
  const fallbackItem = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (!fallbackItem) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const catObj = FALLBACK_CATEGORIES.find((c) => c.id === fallbackItem.categoryId);
  const revs = FALLBACK_REVIEWS.filter((r) => r.productId === fallbackItem.id);

  return NextResponse.json({
    ...fallbackItem,
    inStock: true,
    categoryName: catObj?.name || fallbackItem.categoryName || "",
    categorySlug: catObj?.slug || "",
    reviews: revs,
  });
}

