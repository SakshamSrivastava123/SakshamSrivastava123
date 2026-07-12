import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/studymate";

  try {
    await mongoose.connect(uri);
    console.log(`[db] connected to MongoDB at ${uri}`);
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    // Don't crash the whole server just because Mongo is briefly unavailable
    // during local dev — retry once after a short delay.
    setTimeout(() => connectDB(), 5000);
  }
}
