import { boolean, index, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./accounts";

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  monthlyPrice: numeric("monthly_price", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("INR"),
  durationDays: integer("duration_days").notNull().default(30),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  messageLimit: integer("message_limit"),
  unlimitedMessaging: boolean("unlimited_messaging").notNull().default(false),
  profileVisibility: text("profile_visibility").notNull().default("standard"),
  advancedSearch: boolean("advanced_search").notNull().default(false),
  priorityListing: boolean("priority_listing").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [index("subscription_plans_active_price_idx").on(table.active, table.monthlyPrice)]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: uuid("plan_id").notNull().references(() => subscriptionPlans.id, { onDelete: "restrict" }),
  status: text("status").notNull().default("active"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  provider: text("provider"),
  providerSubscriptionRef: text("provider_subscription_ref"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("subscriptions_status_expiry_idx").on(table.status, table.expiresAt), index("subscriptions_user_status_idx").on(table.userId, table.status), index("subscriptions_plan_idx").on(table.planId)]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"),
  provider: text("provider").notNull(),
  providerPaymentRef: text("provider_payment_ref"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("payments_status_created_idx").on(table.status, table.createdAt), index("payments_user_idx").on(table.userId)]);
