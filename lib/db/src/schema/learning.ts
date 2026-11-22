import { boolean, index, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./accounts";

export const courseCategories = pgTable("course_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  categoryId: uuid("category_id").references(() => courseCategories.id, { onDelete: "set null" }),
  thumbnailPath: text("thumbnail_path"),
  duration: text("duration").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  isFree: boolean("is_free").notNull().default(true),
  status: text("status").notNull().default("draft"),
  content: jsonb("content").$type<Array<{ title: string; body: string; link?: string }>>().notNull().default([]),
  externalLink: text("external_link"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [index("courses_status_category_idx").on(table.status, table.categoryId), index("courses_created_idx").on(table.createdAt)]);

export const courseEnrollments = pgTable("course_enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (table) => [index("course_enrollments_course_status_idx").on(table.courseId, table.status), index("course_enrollments_user_idx").on(table.userId)]);
