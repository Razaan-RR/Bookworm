// src/components/user/RecommendationsSection.jsx
import React from "react";
import RecommendationCard from "./RecommendationCard";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Shelf from "@/models/Shelf";
import Book from "@/models/Book";
import { connectDB } from "@/lib/db";

const RecommendationsSection = async () => {
  await connectDB(); // Ensure DB connection

  const user = await getCurrentUser();
  if (!user) return <p>No recommendations available yet.</p>;

  // Get "read" books for this user and convert to plain objects
  const readShelves = await Shelf.find({ userId: user.id, shelf: "read" })
    .populate("bookId")
    .lean();

  let recommendedBooks = [];

  if (readShelves.length >= 3) {
    // Count most read genres
    const genreCounts = {};
    readShelves.forEach((shelf) => {
      const genre = shelf.bookId?.genre || "Unknown";
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    const topGenres = Object.keys(genreCounts).sort(
      (a, b) => genreCounts[b] - genreCounts[a]
    );

    // Get recommended books in top genres, sort by rating, limit to 9
    recommendedBooks = await Book.find({ genre: { $in: topGenres } })
      .sort({ rating: -1 })
      .limit(9)
      .lean();
  } else {
    // Fallback: popular books
    recommendedBooks = await Book.find()
      .sort({ rating: -1 })
      .limit(8)
      .lean();
  }

  if (!recommendedBooks.length) return <p>No recommendations available yet.</p>;

  // Convert _id to string and flatten genre if populated
  const booksForClient = recommendedBooks.map((book) => ({
    _id: book._id.toString(),
    title: book.title,
    coverImage: book.coverImage,
    genre: typeof book.genre === "object" ? book.genre.name : book.genre,
    rating: book.rating || 0,
    reason: book.reason || null, // optional explanation
  }));

  return (
    <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
      {booksForClient.map((book) => (
        <RecommendationCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default RecommendationsSection;
