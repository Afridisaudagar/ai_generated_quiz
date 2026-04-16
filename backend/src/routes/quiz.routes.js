import express from "express";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

import { Quiz } from "../models/quiz.model.js";
import { Score } from "../models/score.model.js";
import { IdentiyUser } from "../middleware/auth.middleware.js";

import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});


// AI GENERATE QUIZ
router.post("/generate", IdentiyUser, async (req, res) => {
  try {
    const { prompt, skills, timeLimit, isDynamic = true } = req.body;
    
    // If it's a dynamic template, we don't generate questions now.
    // We just save the template details so every user gets a fresh set later.
    if (isDynamic) {
        const quiz = await Quiz.create({
          subject: prompt,
          questions: [], // Empty questions means hit the dynamic generator on attempt
          timeLimit: timeLimit || 30,
          createdBy: req.user.id,
          isDynamic: true,
          targetSkills: skills || "general knowledge, technical concepts"
        });
        return res.json(quiz);
    }

    // LEGACY: Static generation (if explicitly requested)
    // Create a high-entropy seed to ensure absolute uniqueness from the LLM
    const sessionSeed = `${Math.random().toString(36).substring(7)}-${Date.now()}`;

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: `You are an advanced AI quiz generator for a premium AI education platform called "Antigravity". Your task is to generate a UNIQUE and NON-REPETITIVE quiz every time, even if the same topic is requested multiple times.`
        },
        {
          role: "user",
          content: `
IMPORTANT RULES (STRICT):

1. Topic: Generate questions ONLY from this topic: "${prompt}"
2. Skills: Questions must test these skills: "${skills || "general knowledge, technical concepts, problem solving"}"
Each question MUST include a "skill" field from the given skills.

3. Uniqueness (VERY IMPORTANT):
* Every response MUST be completely different from previous responses
* Use different concepts, angles, and scenarios
* Change wording, structure, and difficulty each time
* Avoid repeating common or standard textbook questions
* Randomize question types and order
* SESSION SEED: ${sessionSeed} (Make this set of questions fundamentally different from any other set for this topic)

4. Question Variety: Include a mix of: Conceptual questions, Code-based questions, Debugging questions, Output prediction questions.
5. Difficulty Distribution: Mix of Easy, Medium, Hard
6. Anti-Repetition Strategy: Do NOT reuse patterns, Create fresh scenarios.
7. Smart Randomization: Vary question framing automatically.

8. Output Format (STRICT JSON ONLY - NO MARKDOWN - NO TEXT):
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "skill": "one of the given skills",
      "difficulty": "easy | medium | hard"
    }
  ]
}

9. Count: Generate exactly 10 questions.
10. Final Instruction: Ensure absolute maximum uniqueness.`
        }
      ]
    });

    let text = response.choices[0].message.content;

    text = text
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();

    let data = JSON.parse(text);
    let questions = data.questions ? data.questions : data;

    // Support both format keys safely
    const formattedQuestions = questions.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.correctAnswer || q.answer,
      skill: q.skill || "knowledge",
      difficulty: q.difficulty || "medium"
    }));

    const quiz = await Quiz.create({
      subject: prompt,
      questions: formattedQuestions.slice(0, 10),
      timeLimit: timeLimit || 30,
      createdBy: req.user.id,
      isDynamic: false,
      targetSkills: skills
    });

    res.json(quiz);

  } catch (error) {
    console.error("MISTRAL ERROR:", error.message);

    const fallback = [
      {
        question: "What is rdhj?",
        options: ["Library","Framework","Language","Database"],
        answer: "Library"
      },
      {
        question: "What is Node.js?",
        options: ["Runtime","Browser","Framework","Database"],
        answer: "Runtime"
      },
      {
        question: "Which hook manages state?",
        options: ["useRef","useState","useEffect","useMemo"],
        answer: "useState"
      },
      {
        question: "MongoDB is?",
        options: ["SQL","NoSQL","Language","Framework"],
        answer: "NoSQL"
      },
      {
        question: "Express is?",
        options: ["Framework","Library","Database","Language"],
        answer: "Framework"
      }
    ];

    const quiz = await Quiz.create({
      subject: "Fallback",
      questions: fallback,
      timeLimit: 30
    });

    res.json(quiz);
  }
});


// (Legacy /quiz route removed to prevent stale data)


// Submit score
router.post("/submit", IdentiyUser, async (req, res) => {
  try {
    const { score } = req.body;
    const newScore = await Score.create({
      user: req.user.id,
      score,
    });
    res.json(newScore);
  } catch (err) {
    res.status(500).json({ message: "Error saving score" });
  }
});


// ADMIN CREATE CUSTOM QUIZ
router.post("/create", IdentiyUser, async (req, res) => {
  try {
    const { subject, questions } = req.body;
    const quiz = await Quiz.create({ subject, questions });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Error creating quiz" });
  }
});


// GET ALL QUIZZES
router.get("/all", IdentiyUser, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});


// DELETE QUIZ
router.delete("/:id", IdentiyUser, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting quiz" });
  }
});

// STUDENT FETCH ALL QUIZZES
router.get("/student/all", IdentiyUser, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});

router.get("/:id", IdentiyUser, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // FORCE DYNAMIC: If it was created by an admin through the AI generator 
    // OR if it's explicitly marked dynamic OR if it has no questions.
    const isAiGenerated = quiz.isDynamic || quiz.createdBy || (quiz.questions && quiz.questions.length <= 10);
    const isManualQuiz = quiz.subject === "Custom Quiz" || !quiz.targetSkills; // Simple heuristic

    if (isAiGenerated && !isManualQuiz) {
      const topic = quiz.subject;
      const skills = quiz.targetSkills || "Knowledge, Application, Analysis";
      const userId = req.user.id;

      // Entropy values (Extra Boost)
      const userSeed = userId || "anonymous";
      const timestamp = Date.now();
      const randomValue = Math.random();

      try {
        const response = await client.chat.complete({
          model: "mistral-small-latest",
          messages: [
            {
              role: "system",
              content: `You are an advanced AI quiz generator for an AI education platform called "Antigravity". 
CRITICAL CONTEXT: This quiz is generated dynamically for each user. Multiple users may request quizzes for the SAME topic at the SAME time.`
            },
            {
              role: "user",
              content: `
USER_ENTROPY:
- userSeed: ${userSeed}
- timestamp: ${timestamp}
- random: ${randomValue}

You MUST use this entropy to generate a UNIQUE quiz every time.

---
STRICT RULES:

1. Topic Restriction: Generate questions ONLY from this category: "${topic}"
2. Skills Restriction: Generate questions ONLY based on these skills: "${skills}"
Each question MUST include a "skill" field.

---
3. ⚠️ USER-SPECIFIC UNIQUENESS (MOST IMPORTANT):
* Use the entropy values (userSeed, timestamp, random) as a RANDOM SEED
* These values are DIFFERENT for each user -> so output MUST be DIFFERENT

You MUST:
* Change concepts used in questions
* Change question wording completely
* Use different real-world scenarios
* Use different examples (numbers, variables, cases)
* Shuffle difficulty and types

Even if topic & skills are SAME:
👉 Questions MUST NOT match across users

---
4. Anti-Repetition:
* NEVER repeat questions
* NEVER generate similar patterns
* Avoid generic or textbook questions
* Each quiz must feel freshly generated

---
5. Question Variety: Include mix of: Conceptual, Code-based, Debugging, Output prediction.
6. Difficulty Mix: Easy, Medium, Hard
7. Forbidden Questions: DO NOT generate any questions related to unrelated subjects.
8. Output Format (STRICT JSON ONLY):
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "skill": "one of the given skills",
      "difficulty": "easy | medium | hard"
    }
  ]
}

---
9. Count: Generate exactly 10 questions.
10. FINAL INSTRUCTION (CRITICAL): If 100 users request the same topic at the same time, ALL of them MUST receive DIFFERENT question sets using the entropy values.

DO NOT return anything except valid JSON.`
            }
          ],
          temperature: 1,
          topP: 0.95
        });

        let text = response.choices[0].message.content;
        text = text.replace(/```json/gi, "").replace(/```/gi, "").trim();

        let data = JSON.parse(text);
        let questions = data.questions ? data.questions : data;

        const formattedQuestions = questions.map(q => ({
          question: q.question,
          options: q.options,
          answer: q.correctAnswer || q.answer,
          skill: q.skill || "knowledge",
          difficulty: q.difficulty || "medium"
        }));

        return res.json({
          _id: quiz._id,
          subject: quiz.subject,
          timeLimit: quiz.timeLimit,
          questions: formattedQuestions.slice(0, 10),
          isDynamic: true,
          engine: "ChaosV3", // Debug marker to prove new code is live
          sessionEntropy: sessionEntropy.substring(0, 10)
        });

      } catch (aiError) {
        console.error("DYNAMIC AI ERROR:", aiError.message);
        // If it fails, return error rather than stale questions
        return res.status(500).json({ 
          message: "AI Generation failed. This ensures you never get same questions.",
          error: aiError.message 
        });
      }
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz" });
  }
});

export default router;