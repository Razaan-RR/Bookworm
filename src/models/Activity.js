import mongoose from 'mongoose'

const ActivitySchema = new mongoose.Schema(
  {
    userId: String, // who did the action
    type: String, // add_to_shelf | rate_book | finished_book
    bookId: String,
    message: String, // pre-built readable message
  },
  { timestamps: true }
)

export default mongoose.models.Activity ||
  mongoose.model('Activity', ActivitySchema)
