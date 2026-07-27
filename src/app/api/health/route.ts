import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (db) {
      await db.execute(sql`select 1`);
      return Response.json({ ok: true, dbConnected: true });
    }
    return Response.json({ ok: true, dbConnected: false, mode: "static-fallback" });
  } catch {
    return Response.json({ ok: true, dbConnected: false, mode: "static-fallback" });
  }
}

