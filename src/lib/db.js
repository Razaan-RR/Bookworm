import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI in .env.local");
}

const uri = process.env.MONGODB_URI;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db();
}
