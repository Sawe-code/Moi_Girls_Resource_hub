import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Define the global mongoose cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize cache
const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
};

// Set global cache
global.mongoose = cached;

/**
 * Connect to MongoDB with retry logic and proper error handling
 */
async function connectToDatabase(retries = 3): Promise<typeof mongoose> {
  // If connection exists, return it
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      retryReads: true,
    };

    console.log("🔄 Connecting to MongoDB...");

    // Create connection promise with retry logic
    const connectWithRetry = async (remainingRetries: number): Promise<typeof mongoose> => {
      try {
        const connection = await mongoose.connect(MONGODB_URI!, opts);
        console.log("✅ MongoDB connected successfully");
        return connection;
      } catch (error) {
        if (remainingRetries > 0) {
          console.log(`⚠️ Connection failed. Retrying... (${remainingRetries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          return connectWithRetry(remainingRetries - 1);
        }
        throw error;
      }
    };

    cached.promise = connectWithRetry(retries).catch(error => {
      console.error("❌ MongoDB connection failed after all retries:", error);
      cached.promise = null; // Reset promise on failure
      throw new Error(`Database connection failed: ${error.message}`);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise on error
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;