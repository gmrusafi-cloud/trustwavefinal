import { db } from "@/db";
import { reviews, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, author, rating, title, body: reviewBody } = body;

    if (!productId || !author || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (db) {
      const [review] = await db
        .insert(reviews)
        .values({
          productId,
          author,
          rating: Math.min(5, Math.max(1, rating)),
          title: title || null,
          body: reviewBody || null,
          verified: false,
        })
        .returning();

      // Update product review count and average rating
      const allReviews = await db.select({ rating: reviews.rating }).from(reviews).where(eq(reviews.productId, productId));
      const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;

      await db
        .update(products)
        .set({
          reviewCount: allReviews.length,
          rating: avgRating.toFixed(1),
        })
        .where(eq(products.id, productId));

      return NextResponse.json(review, { status: 201 });
    }

    // Fallback response if DB not available
    const newReview = {
      id: Date.now(),
      productId,
      author,
      rating,
      title: title || "",
      body: reviewBody || "",
      verified: false,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

