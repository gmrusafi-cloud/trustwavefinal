import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, ilike, desc, asc, and, sql, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/db/fallback-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "featured";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const featured = searchParams.get("featured");

  if (db) {
    try {
      const conditions: SQL[] = [];

      if (category) {
        const cat = await db.select().from(categories).where(eq(categories.slug, category)).limit(1);
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
          description: products.description,
          price: products.price,
          compareAtPrice: products.compareAtPrice,
          images: products.images,
          badge: products.badge,
          featured: products.featured,
          rating: products.rating,
          reviewCount: products.reviewCount,
          categoryId: products.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(where)
        .orderBy(orderBy);

      if (result.length > 0) {
        return NextResponse.json(result);
      }
    } catch (e) {
      console.error("Database query error in products API:", e);
    }
  }

  // Fallback filtering
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
      (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
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

  const output = filtered.map((p) => {
    const c = FALLBACK_CATEGORIES.find((cat) => cat.id === p.categoryId);
    return {
      ...p,
      categoryName: c?.name || p.categoryName || "",
      categorySlug: c?.slug || "",
    };
  });

  return NextResponse.json(output);
}

