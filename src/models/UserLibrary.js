import mongoose from 'mongoose'

const UserLibrarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    shelf: {
      type: String,
      enum: ['want', 'reading', 'read'],
      required: true,
      default: 'want',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
)

UserLibrarySchema.index({ userId: 1, bookId: 1 }, { unique: true })

export default mongoose.models.UserLibrary ||
  mongoose.model('UserLibrary', UserLibrarySchema)
