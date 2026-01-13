import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cover: { type: String, required: true },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.models.Book || mongoose.model('Book', BookSchema)
