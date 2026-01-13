import mongoose from "mongoose";

const ShelfSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    shelf: {
      type: String,
      enum: ["wantToRead", "reading", "read"],
      required: true,
    },
    progress: { type: Number, default: 0 }, // pages or %
    finishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Shelf = mongoose.models.Shelf || mongoose.model("Shelf", ShelfSchema);
export default Shelf;
