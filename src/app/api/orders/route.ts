import { db } from "@/db";
import { orders } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      items,
      subtotal,
      shipping,
      total,
    } = body;

    if (!customerName || !customerEmail || !shippingAddress || !city || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (db) {
      const [order] = await db
        .insert(orders)
        .values({
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          shippingAddress,
          city,
          postalCode: postalCode || null,
          items,
          subtotal: String(subtotal),
          shipping: String(shipping),
          total: String(total),
          status: "pending",
        })
        .returning();

      return NextResponse.json(order, { status: 201 });
    }

    // Fallback response if DB not available
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    return NextResponse.json(
      {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        items,
        subtotal,
        shipping,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

