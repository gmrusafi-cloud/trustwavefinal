import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 20 }).default("admin"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  icon: text("icon"),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isFeatured: boolean("is_featured").default(false),
  visibility: boolean("visibility").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productLabels = pgTable("product_labels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  bgColor: varchar("bg_color", { length: 20 }),
  textColor: varchar("text_color", { length: 20 }),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  categoryId: integer("category_id").references(() => categories.id),
  images: jsonb("images").$type<string[]>().default([]),
  thumbnail: text("thumbnail"),
  brand: varchar("brand", { length: 100 }),
  sku: varchar("sku", { length: 100 }),
  stockQuantity: integer("stock_quantity").default(10),
  weight: numeric("weight", { precision: 8, scale: 2 }),
  variants: jsonb("variants").$type<Record<string, any>>().default({}),
  features: jsonb("features").$type<string[]>().default([]),
  warranty: varchar("warranty", { length: 100 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  status: varchar("status", { length: 20 }).default("published"),
  badge: varchar("badge", { length: 50 }),
  featured: boolean("featured").default(false),
  newArrival: boolean("new_arrival").default(false),
  bestSeller: boolean("best_seller").default(false),
  trending: boolean("trending").default(false),
  flashSale: boolean("flash_sale").default(false),
  recommended: boolean("recommended").default(false),
  inStock: boolean("in_stock").default(true),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  specs: jsonb("specs").$type<Record<string, string>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  buttonText: varchar("button_text", { length: 100 }),
  buttonUrl: text("button_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  publishAt: timestamp("publish_at"),
  unpublishAt: timestamp("unpublish_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // 'percentage', 'fixed'
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  freeShipping: boolean("free_shipping").default(false),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }),
  maxUses: integer("max_uses"),
  usesCount: integer("uses_count").default(0),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  body: text("body"),
  verified: boolean("verified").default(false),
  isPinned: boolean("is_pinned").default(false),
  adminReply: text("admin_reply"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 50 }),
  totalOrders: integer("total_orders").default(0),
  totalSpent: numeric("total_spent", { precision: 10, scale: 2 }).default("0"),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  shippingAddress: text("shipping_address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  items: jsonb("items").$type<Array<{ productId: number; name: string; price: number; quantity: number; image: string }>>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminChats = pgTable("admin_chats", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => admins.id),
  message: text("message"),
  fileUrl: text("file_url"),
  readBy: jsonb("read_by").$type<number[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => admins.id),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
