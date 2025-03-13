import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

// Users Table (linked with Clerk's user ID)
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk user ID
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports Table (Each user can have multiple reports)
export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  pdfUrl: varchar("pdf_url", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
