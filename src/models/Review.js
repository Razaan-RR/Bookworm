import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // your users collection
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false, // starts as pending
    },
  },
  { timestamps: true }
)

// Prevent model overwrite on hot reload
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
export default Review
