import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import HomeClient from "./HomeClient";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/db/fallback-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProductsData: any[] = [];
  let categoriesData: any[] = [];
  let newArrivalsData: any[] = [];

  if (db) {
    try {
      // Featured products
      const featured = await db
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
        .where(eq(products.featured, true))
        .orderBy(desc(sql`${products.rating}::numeric`))
        .limit(8);

      featuredProductsData = featured.map((p) => ({
        ...p,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        rating: Number(p.rating),
        image: (p.images as string[])?.[0] || "",
      }));

      // All categories
      categoriesData = await db.select().from(categories).orderBy(categories.name);

      // New arrivals
      const newArrivals = await db
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
        .orderBy(desc(products.createdAt))
        .limit(4);

      newArrivalsData = newArrivals.map((p) => ({
        ...p,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        rating: Number(p.rating),
        image: (p.images as string[])?.[0] || "",
      }));
    } catch (e) {
      console.error("Database error in HomePage, falling back to static data:", e);
    }
  }

  // Use fallbacks if DB is empty or unavailable
  if (featuredProductsData.length === 0) {
    featuredProductsData = FALLBACK_PRODUCTS.filter((p) => p.featured).map((p) => ({
      ...p,
      image: p.images[0] || "",
    }));
  }

  if (categoriesData.length === 0) {
    categoriesData = FALLBACK_CATEGORIES;
  }

  if (newArrivalsData.length === 0) {
    newArrivalsData = FALLBACK_PRODUCTS.slice(0, 4).map((p) => ({
      ...p,
      image: p.images[0] || "",
    }));
  }

  return (
    <HomeClient
      featuredProducts={featuredProductsData}
      categories={categoriesData}
      newArrivals={newArrivalsData}
    />
  );
}

