CREATE TABLE "answers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"image_id" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"questions_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer NOT NULL,
	"content_type" varchar(255) NOT NULL,
	"placeholder" text
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(16) NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_questions_id_questions_id_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_correct_per_question" ON "answers" USING btree ("question_id") WHERE "answers"."is_correct";