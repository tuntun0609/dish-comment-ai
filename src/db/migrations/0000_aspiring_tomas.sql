CREATE TABLE "chat_history" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text,
	"answer" text,
	"created_at" timestamp DEFAULT now()
);
