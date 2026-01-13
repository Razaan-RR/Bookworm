import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    approved: { type: Boolean, default: false }, // pending by default
  },
  { timestamps: true }
)

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
export default Review
