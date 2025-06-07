import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const chatHistory = pgTable('chat_history', {
  id: text('id').primaryKey(),
  question: text('question'),
  answer: text('answer'),
  createdAt: timestamp('created_at').defaultNow(),
})
