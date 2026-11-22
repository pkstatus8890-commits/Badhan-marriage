import { boolean, index, integer, jsonb, pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [index("users_status_idx").on(table.status), index("users_created_at_idx").on(table.createdAt)]);

export const memberSessions = pgTable("member_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("member_sessions_user_expiry_idx").on(table.userId, table.expiresAt)]);

export const otpSendAttempts = pgTable("otp_send_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  phoneHash: text("phone_hash").notNull(),
  ipHash: text("ip_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("otp_send_phone_time_idx").on(table.phoneHash, table.createdAt), index("otp_send_ip_time_idx").on(table.ipHash, table.createdAt)]);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  status: text("status").notNull().default("active"),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("admin_users_role_status_idx").on(table.role, table.status)]);

export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("admin_sessions_admin_expiry_idx").on(table.adminId, table.expiresAt)]);

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id").notNull().references(() => adminUsers.id, { onDelete: "restrict" }),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("admin_activity_logs_admin_time_idx").on(table.adminId, table.createdAt), index("admin_activity_logs_target_idx").on(table.targetType, table.targetId)]);

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedBy: uuid("updated_by").references(() => adminUsers.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const searchableFields = pgTable("searchable_fields", {
  key: text("key").primaryKey(),
  label: text("label").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const userBlocks = pgTable("user_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  blockerUserId: uuid("blocker_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  blockedUserId: uuid("blocked_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("user_blocks_pair_unique").on(table.blockerUserId, table.blockedUserId), index("user_blocks_blocked_idx").on(table.blockedUserId)]);
