import express from "express";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

import { Quiz } from "../models/quiz.model.js";
import { Score } from "../models/score.model.js";
import { IdentiyUser } from "../middleware/auth.middleware.js";

import { Mistral } from "@mistralai/mistralai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to extract JSON from AI response strings
const extractJson = (text) => {
  try {
    // Look for everything between the first { or [ and the last } or ]
    const jsonMatch = text.match(/[\{\[][\s\S]*[\}\]]/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    let jsonStr = jsonMatch[0];
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("JSON PARSE ERROR:", err.message);
    // Fallback cleanup for common LLM noise
    let cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();
    try {
      return JSON.parse(cleanText);
    } catch (innerErr) {
       throw new Error("Could not parse AI response as JSON");
    }
  }
};


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


// Get user's own scores
router.get("/my-scores", IdentiyUser, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my scores" });
  }
});


// Submit score
router.post("/submit", IdentiyUser, async (req, res) => {
  try {
    const { score, quizId, questions } = req.body;
    const newScore = await Score.create({
      user: req.user.id,
      quiz: quizId,
      score,
      questions // Store the questions seen in this session
    });
    res.json(newScore);
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
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

    // FORCE DYNAMIC: Students always get a fresh set if the quiz is AI-compatible
    const isAiCompatible = quiz.subject && (quiz.isDynamic || quiz.questions.length <= 10);
    const isStudent = req.user.role === "student" || true; // Apply to all for now to be safe

    if (isAiCompatible && isStudent) {
      const topic = quiz.subject;
      const skills = quiz.targetSkills || "Knowledge, Application, Analysis";
      const userId = req.user.id;

      // Entropy values (Extra Boost)
      const userSeed = userId || "anonymous";
      const timestamp = Date.now();
      const randomValue = Math.random();

      // ADVANCED UNIQUENESS: Topic Jittering
      const angles = ["Practical/Scenario-based", "Theoretical/Conceptual", "Debugging/Problem-solving", "Edge-cases/Advanced"];
      const selectedAngle = angles[Math.floor(randomValue * angles.length)];

      // FEATURE: Non-Repetitive AI (Fetch user history for this quiz)
      const previousAttempts = await Score.find({ 
          user: userId, 
          quiz: quiz._id 
      }).sort({ createdAt: -1 }).limit(3);

      const historyQuestions = previousAttempts.flatMap(attempt => 
          (attempt.questions || []).map(q => q.question)
      );

      const excludeConstraint = historyQuestions.length > 0 
        ? `\nFORBIDDEN QUESTIONS (VOID THESE):\n${historyQuestions.join("\n")}\n`
        : "";

      const aiPrompt = `
Generate a UNIQUE 10-question quiz session for Antigravity Platform.
TOPIC: "${topic}"
FOCUS ANGLE: "${selectedAngle}"
SKILLS: "${skills}"
SESSION_SEED: ${timestamp}-${randomValue}

${excludeConstraint}

STRICT INSTRUCTIONS:
1. Every question must be novel and different from common textbook versions.
2. Use different wording and scenarios.
3. Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "skill": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}
`;

      let aiResponseText = "";
      let engineUsed = "Mistral-7B";

      try {
        // Step 1: Try Mistral (Increase timeout to 30s for complex generation)
        try {
          const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000));
          const mistralPromise = client.chat.complete({
            model: "mistral-small-latest",
            messages: [{ role: "user", content: aiPrompt }],
            temperature: 1.15 // High entropy for uniqueness
          });

          const response = await Promise.race([mistralPromise, timeout]);
          aiResponseText = response.choices[0].message.content;
        } catch (mistralErr) {
          console.warn("Mistral Error/Timeout, falling back to Gemini...");
          engineUsed = "Gemini-Pro-Flash";
          // Use -latest suffix which is more reliably supported in many SDK versions
          let geminiModelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
          try {
             const geminiResult = await geminiModelInstance.generateContent(aiPrompt);
             aiResponseText = geminiResult.response.text();
          } catch (geminiErr) {
             console.error("Gemini failed too:", geminiErr.message);
             throw new Error("All AI Engines failed");
          }
        }

        const data = extractJson(aiResponseText);
        const questions = data.questions ? data.questions : data;

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
          engine: engineUsed,
          historyCount: historyQuestions.length,
          angle: selectedAngle
        });

      } catch (aiError) {
        console.error("CRITICAL AI FAILURE:", aiError.message);
        
        // FINAL FALLBACK: Randomized pool to ensure uniqueness even when offline
        const shuffle = (array) => array.sort(() => Math.random() - 0.5);
        
        const baseQuestions = [
          {
            question: `Which fundamental concept of ${topic} is most critical for scalability?`,
            options: ["Modular Design", "Hardcoded Values", "Single File Architecture", "No Documentation"],
            answer: "Modular Design",
            skill: "Architecture",
            difficulty: "medium"
          },
          {
            question: `In the context of ${topic}, what does "Latency" typically refer to?`,
            options: ["Time delay", "Storage capacity", "Color depth", "User count"],
            answer: "Time delay",
            skill: "Technical",
            difficulty: "easy"
          },
          {
            question: `When debugging a ${topic} application, what is the first logical step?`,
            options: ["Checking logs", "Reinstalling OS", "Deleting project", "Ignoring issue"],
            answer: "Checking logs",
            skill: "Problem Solving",
            difficulty: "easy"
          },
          {
            question: `True or False: ${topic} principles are evolving and require constant learning.`,
            options: ["True", "False"],
            answer: "True",
            skill: "Professional Growth",
            difficulty: "easy"
          },
          {
            question: `A "bottleneck" in a ${topic} system results in?`,
            options: ["Reduced performance", "Increased speed", "Better security", "Smaller files"],
            answer: "Reduced performance",
            skill: "Analysis",
            difficulty: "medium"
          },
          {
            question: `What is the primary goal of studying ${topic}?`,
            options: ["Understanding core principles", "Memorizing facts", "Increasing complexity", "None of the above"],
            answer: "Understanding core principles",
            skill: "Analysis",
            difficulty: "easy"
          },
          {
            question: `Which of the following is a key characteristic of ${topic}?`,
            options: ["Efficiency", "Redundancy", "Consistency", "All of the above"],
            answer: "All of the above",
            skill: "Conceptual",
            difficulty: "medium"
          },
          {
            question: "In a professional setting, why is troubleshooting important?",
            options: ["To find the root cause", "To ignore the problem", "To blame others", "To restart everything"],
            answer: "To find the root cause",
            skill: "Problem Solving",
            difficulty: "hard"
          },
          {
            question: `Which tool is most commonly associated with ${topic}?`,
            options: ["Standard industry tools", "Social media", "Basic calculators", "Manual processes"],
            answer: "Standard industry tools",
            skill: "Technical",
            difficulty: "easy"
          },
          {
            question: `How does ${topic} typically improve workflow?`,
            options: ["By automating repetitive tasks", "By adding more manual steps", "By slowing down communication", "It has no impact"],
            answer: "By automating repetitive tasks",
            skill: "Efficiency",
            difficulty: "medium"
          }
        ];
 
        const randomizedQuestions = shuffle(baseQuestions).slice(0, 5); // Take 5 random ones
 
        return res.json({
          _id: quiz._id,
          subject: `${quiz.subject} (Safe Mode)`,
          questions: randomizedQuestions,
          isDynamic: true,
          engine: "Randomized-Fallback",
          historyCount: 0,
          uniqueSeed: Math.random().toString(36).substring(7)
        });
      }
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz" });
  }
});

export default router;