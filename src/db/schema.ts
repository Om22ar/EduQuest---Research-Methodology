import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, pgEnum, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('student'),
  createdAt: timestamp('created_at').defaultNow(),
  currentStreak: integer('current_streak').default(0),
  lastStreakActivity: timestamp('last_streak_activity'),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  objectives: text('objectives').notNull(),
  contentHtml: text('content_html').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id').references(() => lessons.id).notNull(),
  title: text('title').notNull(),
  allowedAttempts: integer('allowed_attempts').default(3),
  createdAt: timestamp('created_at').defaultNow(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  type: text('type').notNull(), // 'mcq', 'short_answer', 'drag_drop'
  prompt: text('prompt').notNull(),
  difficulty: integer('difficulty').default(1).notNull(),
  objective: text('objective').default('General').notNull(),
  hint: text('hint'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const options = pgTable('options', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  text: text('text').notNull(),
  isCorrect: boolean('is_correct').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  lessonId: integer('lesson_id').references(() => lessons.id).notNull(),
  status: text('status').notNull(), // 'not started', 'complete'
  lastAccessed: timestamp('last_accessed').defaultNow(),
});

export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  score: integer('score').notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
});

export const responses = pgTable('responses', {
  id: serial('id').primaryKey(),
  attemptId: integer('attempt_id').references(() => quizAttempts.id).notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  selectedOptionId: integer('selected_option_id').references(() => options.id),
  answerText: text('answer_text'),
});

export const srsReviews = pgTable('srs_reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  interval: integer('interval').default(0).notNull(), // days
  easeFactor: real('ease_factor').default(2.5).notNull(),
  nextReviewDate: timestamp('next_review_date').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  attempts: many(quizAttempts),
  srsReviews: many(srsReviews),
}));

export const lessonsRelations = relations(lessons, ({ many }) => ({
  quizzes: many(quizzes),
  progress: many(userProgress),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id],
  }),
  questions: many(questions),
  attempts: many(quizAttempts),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  options: many(options),
  responses: many(responses),
  srsReviews: many(srsReviews),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one, many }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  attempt: one(quizAttempts, {
    fields: [responses.attemptId],
    references: [quizAttempts.id],
  }),
  question: one(questions, {
    fields: [responses.questionId],
    references: [questions.id],
  }),
  selectedOption: one(options, {
    fields: [responses.selectedOptionId],
    references: [options.id],
  }),
}));

export const srsReviewsRelations = relations(srsReviews, ({ one }) => ({
  user: one(users, {
    fields: [srsReviews.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [srsReviews.questionId],
    references: [questions.id],
  }),
}));
