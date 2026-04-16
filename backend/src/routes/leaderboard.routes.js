import express from "express";
import { Score } from "../models/score.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .populate("user")
      .sort({ score: -1 });
console.log(JSON.stringify(leaderboard, null, 2));
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;