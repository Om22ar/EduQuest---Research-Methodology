import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { db } from "./src/db/index.ts";
import { lessons, quizzes, questions, options, userProgress, quizAttempts, responses, users, srsReviews } from "./src/db/schema.ts";
import { eq, and, asc, lte, desc, sql } from "drizzle-orm";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  async function updateUserStreak(userId: number) {
    try {
      const dbUser = (await db.select().from(users).where(eq(users.id, userId)))[0];
      if (!dbUser) return;
      
      const now = new Date();
      const lastActivity = dbUser.lastStreakActivity ? new Date(dbUser.lastStreakActivity) : null;
      
      let newStreak = dbUser.currentStreak || 0;
      
      if (!lastActivity) {
        newStreak = 1;
      } else {
        const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // check calendar days instead of exact 24 hours
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastActivityDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        
        const dayDiff = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // It's the next day, increment streak
          newStreak += 1;
        } else if (dayDiff > 1) {
          // Missed a day or more, reset streak
          newStreak = 1;
        }
        // If dayDiff === 0, they already did something today, leave streak as is.
      }
      
      await db.update(users).set({
        currentStreak: newStreak,
        lastStreakActivity: now
      }).where(eq(users.id, userId));
      
    } catch (error) {
      console.error("Failed to update streak:", error);
    }
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat Route
  app.post("/api/chat", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { history, message } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          ...history.map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are an expert AI Tutor specialized in Research Methodology. Your role is to help students understand complex research concepts, methodologies, sampling, and data analysis. Provide clear, concise, and educational answers. When possible, relate concepts back to the research phases: Problem, Hypothesis, Methodology, Analysis.",
        }
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Auth route to sync user
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const dbUser = await getOrCreateUser(user.uid, user.email || "", user.name);
      res.json(dbUser);
    } catch (error: any) {
      console.error("Failed to sync user:", error);
      res.status(500).json({ error: error.message || "Failed to sync user" });
    }
  });

  // Get all lessons
  app.get("/api/lessons", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const dbUser = (await db.select().from(users).where(eq(users.uid, user.uid)))[0];
      if (!dbUser) return res.status(401).json({ error: "User not found" });

      const allLessons = await db.select().from(lessons).orderBy(asc(lessons.orderIndex));
      
      const allProgress = await db.select().from(userProgress).where(eq(userProgress.userId, dbUser.id));

      const lessonsWithProgress = allLessons.map(lesson => ({
        ...lesson,
        progress: allProgress.find(p => p.lessonId === lesson.id) || null
      }));

      res.json(lessonsWithProgress);
    } catch (error: any) {
      console.error("Failed to fetch lessons:", error);
      res.status(500).json({ error: error.message || "Failed to fetch lessons" });
    }
  });

  // Get specific lesson details
  app.get("/api/lessons/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lessonRows = await db.select().from(lessons).where(eq(lessons.id, lessonId));
      if (lessonRows.length === 0) {
        res.status(404).json({ error: "Lesson not found" });
        return;
      }
      res.json(lessonRows[0]);
    } catch (error: any) {
      console.error("Failed to fetch lesson:", error);
      res.status(500).json({ error: error.message || "Failed to fetch lesson" });
    }
  });

  // Get quiz for a lesson
  app.get("/api/lessons/:id/quiz", requireAuth, async (req: AuthRequest, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const quizRows = await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));
      if (quizRows.length === 0) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      
      const quiz = quizRows[0];
      const quizQuestions = await db.select().from(questions).where(eq(questions.quizId, quiz.id));
      
      const questionsWithOptions = await Promise.all(quizQuestions.map(async (q) => {
        const questionOptions = await db.select({
          id: options.id,
          text: options.text
        }).from(options).where(eq(options.questionId, q.id));
        return { ...q, options: questionOptions };
      }));

      res.json({ ...quiz, questions: questionsWithOptions });
    } catch (error: any) {
      console.error("Failed to fetch quiz:", error);
      res.status(500).json({ error: error.message || "Failed to fetch quiz" });
    }
  });

  // Get full question bank (with options, objectives, difficulties, hints)
  app.get("/api/question-bank", requireAuth, async (req: AuthRequest, res) => {
    try {
      const allQuestions = await db.select({
        id: questions.id,
        quizId: questions.quizId,
        type: questions.type,
        prompt: questions.prompt,
        difficulty: questions.difficulty,
        objective: questions.objective,
        hint: questions.hint,
      }).from(questions).orderBy(asc(questions.id));

      const questionsWithOptions = await Promise.all(allQuestions.map(async (q) => {
        const qOptions = await db.select({
          id: options.id,
          text: options.text,
          isCorrect: options.isCorrect,
        }).from(options).where(eq(options.questionId, q.id));
        return { ...q, options: qOptions };
      }));

      res.json(questionsWithOptions);
    } catch (error: any) {
      console.error("Failed to fetch question bank:", error);
      res.status(500).json({ error: error.message || "Failed to fetch question bank" });
    }
  });

  // Evaluate single question for adaptive routing
  app.post("/api/questions/:id/evaluate", requireAuth, async (req: AuthRequest, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const { answer } = req.body;
      const questionRows = await db.select().from(questions).where(eq(questions.id, questionId));
      if (questionRows.length === 0) return res.status(404).json({ error: "Question not found" });
      const q = questionRows[0];

      let isCorrect = false;
      const correctOption = (await db.select().from(options).where(and(eq(options.questionId, q.id), eq(options.isCorrect, true))))[0];
      
      if (q.type === 'mcq' && correctOption && answer === correctOption.id) {
        isCorrect = true;
      } else if (q.type !== 'mcq' && correctOption && String(answer).trim().toLowerCase() === correctOption.text.trim().toLowerCase()) {
        isCorrect = true;
      }
      
      res.json({ isCorrect, correctOptionId: correctOption?.id, hint: q.hint });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Submit quiz (Finalizes attempt and processes SRS)
  app.post("/api/quizzes/:id/submit", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const dbUser = (await db.select().from(users).where(eq(users.uid, user.uid)))[0];
      if (!dbUser) return res.status(401).json({ error: "User not found" });

      const quizId = parseInt(req.params.id);
      const { answers } = req.body; // Record<questionId, optionId | string>

      const quizRows = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
      if (quizRows.length === 0) return res.status(404).json({ error: "Quiz not found" });
      const quiz = quizRows[0];

      const quizQuestions = await db.select().from(questions).where(eq(questions.quizId, quizId));
      
      let score = 0;
      
      const results: any = [];

      for (const q of quizQuestions) {
        const answer = answers[q.id];
        // Only process questions that were actually answered in the adaptive flow
        if (answer === undefined) continue;

        let isCorrect = false;
        const correctOption = (await db.select().from(options).where(and(eq(options.questionId, q.id), eq(options.isCorrect, true))))[0];

        if (q.type === 'mcq') {
          if (correctOption && answer === correctOption.id) {
            isCorrect = true;
            score++;
          }
          results.push({ questionId: q.id, isCorrect, correctOptionId: correctOption?.id });
        } else {
           if (correctOption && String(answer).trim().toLowerCase() === correctOption.text.trim().toLowerCase()) {
             isCorrect = true;
             score++;
           }
           results.push({ questionId: q.id, isCorrect, correctText: correctOption?.text });
        }

        // Process SRS logic for this question
        const existingReview = await db.select().from(srsReviews).where(and(eq(srsReviews.userId, dbUser.id), eq(srsReviews.questionId, q.id)));
        let interval = 0;
        let ease = 2.5;
        if (existingReview.length > 0) {
          interval = existingReview[0].interval;
          ease = existingReview[0].easeFactor;
        }
        
        if (isCorrect) {
          interval = interval === 0 ? 1 : interval === 1 ? 6 : Math.round(interval * ease);
          ease = Math.min(2.5, ease + 0.1);
        } else {
          interval = 1;
          ease = Math.max(1.3, ease - 0.2);
        }
        
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);
        
        if (existingReview.length > 0) {
          await db.update(srsReviews).set({ interval, easeFactor: ease, nextReviewDate }).where(eq(srsReviews.id, existingReview[0].id));
        } else {
          await db.insert(srsReviews).values({ userId: dbUser.id, questionId: q.id, interval, easeFactor: ease, nextReviewDate });
        }
      }

      // Max score is based on the number of questions actually presented in adaptive mode
      const maxScore = results.length || 1;
      const scorePercent = Math.round((score / maxScore) * 100);

      // Record attempt
      const attempt = (await db.insert(quizAttempts).values({
        userId: dbUser.id,
        quizId,
        score: scorePercent
      }).returning())[0];

      // Update progress if mastery reached (e.g., >= 90% per user request)
      if (scorePercent >= 90) {
        const existingProgress = await db.select().from(userProgress).where(and(eq(userProgress.userId, dbUser.id), eq(userProgress.lessonId, quiz.lessonId)));
        
        if (existingProgress.length > 0) {
           await db.update(userProgress).set({ status: 'complete', lastAccessed: new Date() }).where(eq(userProgress.id, existingProgress[0].id));
        } else {
           await db.insert(userProgress).values({
            userId: dbUser.id,
            lessonId: quiz.lessonId,
            status: 'complete',
            lastAccessed: new Date()
          });
        }
      }

      await updateUserStreak(dbUser.id);

      res.json({ score: scorePercent, results, passed: scorePercent >= 90 });
    } catch (error: any) {
      console.error("Failed to submit quiz:", error);
      res.status(500).json({ error: error.message || "Failed to submit quiz" });
    }
  });

  // Get due reviews
  app.get("/api/reviews/due", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const dbUser = (await db.select().from(users).where(eq(users.uid, user.uid)))[0];
      if (!dbUser) return res.status(401).json({ error: "User not found" });

      const now = new Date();
      const dueReviews = await db.select().from(srsReviews).where(and(
        eq(srsReviews.userId, dbUser.id),
        lte(srsReviews.nextReviewDate, now)
      ));
      
      if (dueReviews.length === 0) return res.json([]);

      // Fetch the actual questions and options for due reviews
      const questionIds = dueReviews.map(r => r.questionId);
      const reviewQuestions = [];
      for (const id of questionIds) {
        const qRows = await db.select().from(questions).where(eq(questions.id, id));
        if (qRows.length > 0) {
          const q = qRows[0];
          const questionOptions = await db.select({ id: options.id, text: options.text }).from(options).where(eq(options.questionId, q.id));
          reviewQuestions.push({ ...q, options: questionOptions, reviewId: dueReviews.find(r => r.questionId === id)?.id });
        }
      }

      res.json(reviewQuestions);
    } catch (error: any) {
      console.error("Failed to fetch due reviews:", error);
      res.status(500).json({ error: error.message || "Failed to fetch due reviews" });
    }
  });

  // Get all scheduled reviews for the user (for upcoming review reminders)
  app.get("/api/reviews/upcoming", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const dbUser = (await db.select().from(users).where(eq(users.uid, user.uid)))[0];
      if (!dbUser) return res.status(401).json({ error: "User not found" });

      const scheduled = await db.select({
        id: srsReviews.id,
        questionId: srsReviews.questionId,
        interval: srsReviews.interval,
        easeFactor: srsReviews.easeFactor,
        nextReviewDate: srsReviews.nextReviewDate,
        objective: questions.objective,
        prompt: questions.prompt
      })
      .from(srsReviews)
      .innerJoin(questions, eq(srsReviews.questionId, questions.id))
      .where(eq(srsReviews.userId, dbUser.id))
      .orderBy(asc(srsReviews.nextReviewDate));

      res.json(scheduled);
    } catch (error: any) {
      console.error("Failed to fetch upcoming reviews:", error);
      res.status(500).json({ error: error.message || "Failed to fetch upcoming reviews" });
    }
  });

  // Submit single review evaluation (processes SRS immediately)
  app.post("/api/reviews/:id/evaluate", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const dbUser = (await db.select().from(users).where(eq(users.uid, user.uid)))[0];
      if (!dbUser) return res.status(401).json({ error: "User not found" });

      const questionId = parseInt(req.params.id);
      const { answer } = req.body;
      
      const questionRows = await db.select().from(questions).where(eq(questions.id, questionId));
      if (questionRows.length === 0) return res.status(404).json({ error: "Question not found" });
      const q = questionRows[0];

      let isCorrect = false;
      const correctOption = (await db.select().from(options).where(and(eq(options.questionId, q.id), eq(options.isCorrect, true))))[0];
      
      if (q.type === 'mcq' && correctOption && answer === correctOption.id) {
        isCorrect = true;
      } else if (q.type !== 'mcq' && correctOption && String(answer).trim().toLowerCase() === correctOption.text.trim().toLowerCase()) {
        isCorrect = true;
      }

      // Update SRS
      const existingReviewRows = await db.select().from(srsReviews).where(and(eq(srsReviews.userId, dbUser.id), eq(srsReviews.questionId, q.id)));
      if (existingReviewRows.length > 0) {
        const existingReview = existingReviewRows[0];
        let interval = existingReview.interval;
        let ease = existingReview.easeFactor;
        
        if (isCorrect) {
          interval = interval === 0 ? 1 : interval === 1 ? 6 : Math.round(interval * ease);
          ease = Math.min(2.5, ease + 0.1);
        } else {
          interval = 1;
          ease = Math.max(1.3, ease - 0.2);
        }
        
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);
        
        await db.update(srsReviews).set({ interval, easeFactor: ease, nextReviewDate }).where(eq(srsReviews.id, existingReview.id));
      }
      
      await updateUserStreak(dbUser.id);
      
      res.json({ isCorrect, correctOptionId: correctOption?.id, hint: q.hint });
    } catch (error: any) {
      console.error("Failed to evaluate review:", error);
      res.status(500).json({ error: error.message });
    }
  });


  // Leaderboard endpoint
  app.get("/api/leaderboard", requireAuth, async (req: AuthRequest, res) => {
    try {
      const result = await db.select({
        userId: users.id,
        name: users.name,
        email: users.email,
        totalPoints: sql<number>`cast(sum(${quizAttempts.score}) as integer)`
      })
      .from(users)
      .innerJoin(quizAttempts, eq(users.id, quizAttempts.userId))
      .groupBy(users.id, users.name, users.email)
      .orderBy(desc(sql`sum(${quizAttempts.score})`))
      .limit(10);
      
      res.json(result);
    } catch (error: any) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Heatmap endpoint (Proficiency by objective)
  app.get("/api/stats/heatmap", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const dbUser = (await db.select().from(users).where(eq(users.uid, user.uid)))[0];
      if (!dbUser) return res.status(401).json({ error: "User not found" });

      const result = await db.select({
        objective: questions.objective,
        proficiency: sql<number>`cast(avg(${srsReviews.easeFactor}) as float)`
      })
      .from(srsReviews)
      .innerJoin(questions, eq(srsReviews.questionId, questions.id))
      .where(eq(srsReviews.userId, dbUser.id))
      .groupBy(questions.objective);

      res.json(result);
    } catch (error: any) {
      console.error("Heatmap error:", error);
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  });

  // Streak endpoint
  app.get("/api/stats/streak", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const dbUser = (await db.select().from(users).where(eq(users.uid, user.uid)))[0];
      if (!dbUser) return res.status(401).json({ error: "User not found" });

      res.json({ streak: dbUser.currentStreak || 0 });
    } catch (error: any) {
      console.error("Streak error:", error);
      res.status(500).json({ error: "Failed to fetch streak" });
    }
  });

  // Question Bank & Statistical Summary endpoints
  app.get("/api/question-bank", async (req, res) => {
    const { QUESTION_BANK } = await import("./src/data/questionBankData.ts");
    res.json(QUESTION_BANK);
  });

  app.get("/api/statistical-summary", async (req, res) => {
    const { STATISTICAL_REVISION_SUMMARY } = await import("./src/data/questionBankData.ts");
    res.json(STATISTICAL_REVISION_SUMMARY);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Auto-seed if database has no questions
  try {
    const qCount = await db.select({ count: sql<number>`count(*)` }).from(questions);
    if (Number(qCount[0]?.count || 0) < 10) {
      console.log("Database has fewer than 10 questions. Auto-seeding question bank...");
      const { seed } = await import("./src/db/seed.ts");
      await seed();
    }
  } catch (seedErr) {
    console.error("Auto-seed check notice:", seedErr);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
