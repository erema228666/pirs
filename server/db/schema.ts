import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  
} from "drizzle-orm/pg-core";

export * from "./auth-schema"

export const files = pgTable("files",{
  id: varchar("id", { length: 255}).primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  contentType: varchar("content_type", { length: 255 }).notNull(),
  placeholder: text("placeholder"),
})

export const blocks = pgTable("blocks",{
    id: varchar("id", {length: 255}).primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    imageId: varchar("image_id", { length: 255 })
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    questionsId: varchar("questions_id", {length: 255}).references(() => questions.id, {onDelete: "cascade"}),
})

export const questions = pgTable("questions", {
    id: varchar("id", { length: 255 }).primaryKey().notNull()
        .$defaultFn(() => crypto.randomUUID()),
    type: varchar("type", { length: 16 }).notNull(), // 'quest' | 'test'
    text: text("text").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const answers = pgTable("answers", {
    id: varchar("id", { length: 255 }).primaryKey().notNull()
        .$defaultFn(() => crypto.randomUUID()),
    imageId: varchar("image_id", { length: 255 })
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),
    questionId: varchar("question_id", { length: 255 })
        .notNull()
        .references(() => questions.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
}, (t) => ({
    oneCorrect: uniqueIndex("one_correct_per_question")
        .on(t.questionId).where(sql`${t.isCorrect}`),
}));