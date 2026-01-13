// src/models/Library.js
import mongoose from 'mongoose'

const LibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  shelf: { type: String, enum: ['Want to Read', 'Currently Reading', 'Read'], default: 'Want to Read' },
  pagesRead: { type: Number, default: 0 },
  userRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Library || mongoose.model('Library', LibrarySchema)
