import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import ReadingGoal from "@/models/ReadingGoal";
import UserLibrary from "@/models/UserLibrary";

export async function GET(req) {
  try {
    await connectDB();

    const userIdStr = req.nextUrl.searchParams.get("userId");
    if (!userIdStr) {
      return NextResponse.json({ error: "No userId" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(userIdStr);
    const year = new Date().getFullYear();

    // Get the reading goal
    const readingGoal = await ReadingGoal.findOne({ userId, year }).lean();

    // Count "read" books from UserLibrary
    const booksRead = await UserLibrary.countDocuments({
      userId,
      shelf: "read",
    });

    return NextResponse.json({ readingGoal, booksRead }, { status: 200 });
  } catch (error) {
    console.error("GET reading goal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId, goal } = await req.json();
    const year = new Date().getFullYear();

    if (!userId || !goal) {
      return NextResponse.json({ error: "Missing userId or goal" }, { status: 400 });
    }

    // Update if exists, else create
    const updatedGoal = await ReadingGoal.findOneAndUpdate(
      { userId, year },
      { goal },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedGoal, { status: 201 });
  } catch (error) {
    console.error("Failed to set goal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
