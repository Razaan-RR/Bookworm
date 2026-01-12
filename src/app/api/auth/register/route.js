import { connectToDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  const formData = await req.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const image = formData.get("image");

  if (!name || !email || !password || !image) {
    return Response.json({ message: "Missing fields" }, { status: 400 });
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

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
    image: base64Image,
    role: "user",
    createdAt: new Date(),
  });

  return Response.json({ message: "User created" }, { status: 201 });
}
