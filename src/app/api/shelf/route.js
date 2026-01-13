import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Shelf from "@/models/Shelf";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, bookId, shelf } = await req.json();

    if (!userId || !bookId || !shelf) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updatedShelf = await Shelf.findOneAndUpdate(
      { userId, bookId },
      { shelf },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(updatedShelf, { status: 201 });
  } catch (error) {
    console.error("Failed to update shelf:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
