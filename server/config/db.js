import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loan_management';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${uri}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Notice] Could not connect to MongoDB server at ${uri}: ${error.message}`);
    console.log(`[Hybrid Storage] Active! The system is using the built-in persistent JSON store in server/data/db.json.`);
    console.log(`[Hybrid Storage] You can connect to MongoDB anytime by starting MongoDB or setting MONGODB_URI in server/.env`);
    isConnected = false;
    return false;
  }
}

export function isMongoOnline() {
  return isConnected;
}
