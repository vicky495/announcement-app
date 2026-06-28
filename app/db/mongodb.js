import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  console.log("connectDB() function called");

  if (isConnected) {
    console.log("Already connected");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("✅ MongoDB Connected");
    console.log("Database:", conn.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Error");
    console.error(error.message);
  }
}
