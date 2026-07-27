import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, asc, ilike, and, sql, SQL } from "drizzle-orm";
import ProductsClient from "./ProductsClient";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/db/fallback-data";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  const minPrice = typeof params.minPrice === "string" ? params.minPrice : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : undefined;
  const featured = typeof params.featured === "string" ? params.featured : undefined;

  let productData: any[] = [];
  let allCategories: any[] = [];

  if (db) {
    try {
      const conditions: SQL[] = [];

      if (category) {
        const cat = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, category))
          .limit(1);
        if (cat.length > 0) {
          conditions.push(eq(products.categoryId, cat[0].id));
        }
      }

      if (search) {
        conditions.push(ilike(products.name, `%${search}%`));
      }

      if (minPrice) {
        conditions.push(sql`${products.price}::numeric >= ${Number(minPrice)}`);
      }

      if (maxPrice) {
        conditions.push(sql`${products.price}::numeric <= ${Number(maxPrice)}`);
      }

      if (featured === "true") {
        conditions.push(eq(products.featured, true));
      }

      let orderBy;
      switch (sort) {
        case "price-asc":
          orderBy = asc(sql`${products.price}::numeric`);
          break;
        case "price-desc":
          orderBy = desc(sql`${products.price}::numeric`);
          break;
        case "rating":
          orderBy = desc(sql`${products.rating}::numeric`);
          break;
        case "newest":
          orderBy = desc(products.createdAt);
          break;
        case "name":
          orderBy = asc(products.name);
          break;
        default:
          orderBy = desc(products.featured);
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          compareAtPrice: products.compareAtPrice,
          images: products.images,
          badge: products.badge,
          featured: products.featured,
          rating: products.rating,
          reviewCount: products.reviewCount,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(where)
        .orderBy(orderBy);

      allCategories = await db.select().from(categories).orderBy(categories.name);

      productData = result.map((p) => ({
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
        categorySlug: p.categorySlug,
      }));
    } catch (e) {
      console.error("Database error in ProductsPage, falling back to static data:", e);
    }
  }

  // Fallback if DB empty or unavailable
  if (allCategories.length === 0) {
    allCategories = FALLBACK_CATEGORIES;
  }

  if (productData.length === 0) {
    let filtered = [...FALLBACK_PRODUCTS];

    if (category) {
      const catObj = FALLBACK_CATEGORIES.find((c) => c.slug === category);
      if (catObj) {
        filtered = filtered.filter((p) => p.categoryId === catObj.id);
      }
    }

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (featured === "true") {
      filtered = filtered.filter((p) => p.featured);
    }

    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    productData = filtered.map((p) => {
      const catObj = FALLBACK_CATEGORIES.find((c) => c.id === p.categoryId);
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
        categoryName: catObj?.name || p.categoryName || "",
        categorySlug: catObj?.slug || "",
      };
    });
  }

  return (
    <ProductsClient
      products={productData}
      categories={allCategories}
      activeCategory={category || null}
      activeSort={sort}
      searchQuery={search || ""}
    />
  );
}

