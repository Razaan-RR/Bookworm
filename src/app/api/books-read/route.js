import { connectDB } from "@/lib/db";
import Shelf from "@/models/Shelf";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return new Response("Missing userId", { status: 400 });

  await connectDB();

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear(), 11, 31);

  const count = await Shelf.countDocuments({
    userId,
    shelf: "read",
    createdAt: { $gte: startOfYear, $lte: endOfYear },
  });

  return new Response(JSON.stringify({ count }), { status: 200 });
}
