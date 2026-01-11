import { connectToDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json({ message: "Missing fields" }, { status: 400 });
  }

  const db = await connectToDatabase();
  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    return Response.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
  });

  return Response.json({ message: "User created" }, { status: 201 });
}
