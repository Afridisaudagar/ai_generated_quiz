import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  score: Number
}, {
  strict: false
});

export const Score = mongoose.model("Score", scoreSchema);