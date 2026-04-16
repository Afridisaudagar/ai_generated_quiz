      import mongoose from "mongoose";

  const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  });

  export const User = mongoose.model("User", userSchema);
