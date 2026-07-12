import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    feature: {
      type: String,
      enum: ["chat", "quiz", "interview", "notes", "summary"],
      default: "chat",
    },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true, unique: true },
    topic: { type: String, default: "" },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
