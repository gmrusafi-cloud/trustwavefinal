import { db } from "@/db";
import { categories } from "@/db/schema";
import { NextResponse } from "next/server";
import { FALLBACK_CATEGORIES } from "@/db/fallback-data";

export async function GET() {
  if (db) {
    try {
      const cats = await db.select().from(categories).orderBy(categories.name);
      if (cats.length > 0) {
        return NextResponse.json(cats);
      }
    } catch (e) {
      console.error("Database query failed in categories API:", e);
    }
  }
  return NextResponse.json(FALLBACK_CATEGORIES);
}

