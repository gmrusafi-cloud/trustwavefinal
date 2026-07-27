import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES, FALLBACK_REVIEWS } from "@/db/fallback-data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let productObj: any = null;
  let productReviews: any[] = [];
  let relatedProducts: any[] = [];

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
        const prod = result[0];
        productObj = {
          ...prod,
          price: Number(prod.price),
          compareAtPrice: prod.compareAtPrice ? Number(prod.compareAtPrice) : null,
          rating: Number(prod.rating),
          images: (prod.images as string[]) || [],
          specs: (prod.specs as Record<string, string>) || {},
        };

        const dbRev = await db
          .select()
          .from(reviews)
          .where(eq(reviews.productId, prod.id))
          .orderBy(desc(reviews.createdAt));

        productReviews = dbRev.map((r) => ({
          ...r,
          createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        }));

        const related = prod.categoryId
          ? await db
              .select({
                id: products.id,
                name: products.name,
                slug: products.slug,
                price: products.price,
                compareAtPrice: products.compareAtPrice,
                images: products.images,
                badge: products.badge,
                rating: products.rating,
                reviewCount: products.reviewCount,
                categoryName: categories.name,
              })
              .from(products)
              .leftJoin(categories, eq(products.categoryId, categories.id))
              .where(eq(products.categoryId, prod.categoryId))
              .limit(5)
          : [];

        relatedProducts = related
          .filter((p) => p.id !== prod.id)
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
            image: (p.images as string[])?.[0] || "",
            badge: p.badge,
            rating: Number(p.rating),
            reviewCount: p.reviewCount ?? 0,
            categoryName: p.categoryName,
          }));
      }
    } catch (e) {
      console.error("Database error in ProductDetailPage, using static data:", e);
    }
  }

  // Fallback if DB not available or item not found in DB
  if (!productObj) {
    const fallbackItem = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    if (!fallbackItem) {
      notFound();
    }

    const catObj = FALLBACK_CATEGORIES.find((c) => c.id === fallbackItem.categoryId);

    productObj = {
      ...fallbackItem,
      inStock: true,
      categoryName: catObj?.name || fallbackItem.categoryName || "",
      categorySlug: catObj?.slug || "",
    };

    productReviews = FALLBACK_REVIEWS.filter((r) => r.productId === fallbackItem.id).map((r) => ({
      ...r,
      createdAt: r.createdAt || new Date().toISOString(),
    }));

    relatedProducts = FALLBACK_PRODUCTS.filter(
      (p) => p.categoryId === fallbackItem.categoryId && p.id !== fallbackItem.id
    )
      .slice(0, 4)
      .map((p) => {
        const c = FALLBACK_CATEGORIES.find((cat) => cat.id === p.categoryId);
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          image: p.images[0] || "",
          badge: p.badge,
          rating: p.rating,
          reviewCount: p.reviewCount,
          categoryName: c?.name || p.categoryName || "",
        };
      });
  }

  return (
    <ProductDetailClient
      product={productObj}
      reviews={productReviews}
      relatedProducts={relatedProducts}
    />
  );
}

