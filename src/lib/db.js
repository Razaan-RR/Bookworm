import { MongoClient } from 'mongodb'

let client
let clientPromise

const uri = process.env.MONGODB_URI
const options = {}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise
export async function connectToDatabase() {
  const client = await clientPromise
  return client.db()
}
