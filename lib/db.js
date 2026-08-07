import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_DIRECT = process.env.MONGODB_URI_DIRECT;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Add it to .env.local");
}

// Reuse connection across hot reloads / serverless invocations
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectWithUri(uri) {
  if (!uri) throw new Error("MongoDB URI is not configured");

  return mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    w: "majority",
  });
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        return await connectWithUri(MONGODB_URI);
      } catch (err) {
        const shouldRetryWithDirect =
          MONGODB_URI_DIRECT &&
          MONGODB_URI_DIRECT !== MONGODB_URI &&
          /querySrv|ENOTFOUND|ECONNREFUSED/i.test(err.message);

        if (shouldRetryWithDirect) {
          console.warn("Primary MongoDB URI failed. Retrying with MONGODB_URI_DIRECT...");
          return connectWithUri(MONGODB_URI_DIRECT);
        }

        throw err;
      }
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
