import { boolean, date, index, integer, pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./accounts";

export const casteCategories = pgTable("caste_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const castesCommunities = pgTable("castes_communities", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => casteCategories.id, { onDelete: "set null" }),
  name: text("name").notNull().unique(),
  stateCoverage: text("state_coverage").array().notNull().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [index("castes_communities_category_active_idx").on(table.categoryId, table.active), index("castes_communities_name_idx").on(table.name)]);

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dateOfBirth: date("date_of_birth", { mode: "string" }).notNull(),
  gender: text("gender").notNull(),
  city: text("city").notNull().default(""),
  district: text("district").notNull().default(""),
  state: text("state").notNull().default(""),
  religion: text("religion").notNull().default("Hindu"),
  communityId: uuid("community_id").references(() => castesCommunities.id, { onDelete: "set null" }),
  subCommunity: text("sub_community").notNull().default(""),
  privateAddress: text("private_address").notNull().default(""),
  education: text("education").notNull().default(""),
  profession: text("profession").notNull().default(""),
  maritalStatus: text("marital_status").notNull().default(""),
  gotra: text("gotra").notNull().default(""),
  height: text("height").notNull().default(""),
  family: text("family").notNull().default(""),
  about: text("about").notNull().default(""),
  partnerPreference: text("partner_preference").notNull().default(""),
  approvalStatus: text("approval_status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  activityStatus: text("activity_status").notNull().default("active"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("profiles_approval_active_idx").on(table.approvalStatus, table.activityStatus),
  index("profiles_gender_dob_idx").on(table.gender, table.dateOfBirth),
  index("profiles_city_state_idx").on(table.city, table.state),
  index("profiles_community_idx").on(table.communityId),
  index("profiles_name_idx").on(table.name),
]);

export const profilePhotos = pgTable("profile_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  objectPath: text("object_path").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  moderationStatus: text("moderation_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("profile_photos_profile_idx").on(table.profileId), index("profile_photos_review_idx").on(table.moderationStatus)]);

export const matrimonialRequests = pgTable("matrimonial_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromProfileId: uuid("from_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  toProfileId: uuid("to_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("matrimonial_requests_pair_unique").on(table.fromProfileId, table.toProfileId),
  index("matrimonial_requests_recipient_status_idx").on(table.toProfileId, table.status),
  index("matrimonial_requests_sender_status_idx").on(table.fromProfileId, table.status),
]);

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").notNull().unique().references(() => matrimonialRequests.id, { onDelete: "cascade" }),
  profileAId: uuid("profile_a_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  profileBId: uuid("profile_b_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("conversations_pair_status_idx").on(table.profileAId, table.profileBId, table.status)]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderProfileId: uuid("sender_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("messages_conversation_created_idx").on(table.conversationId, table.createdAt), index("messages_sender_created_idx").on(table.senderProfileId, table.createdAt)]);

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterUserId: uuid("reporter_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reportedUserId: uuid("reported_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("open"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
}, (table) => [index("reports_status_created_idx").on(table.status, table.createdAt), index("reports_reported_idx").on(table.reportedUserId)]);
