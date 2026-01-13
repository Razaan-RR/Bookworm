import mongoose from 'mongoose'

const ReadingGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    year: { type: Number, required: true },
    goal: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.ReadingGoal ||
  mongoose.model('ReadingGoal', ReadingGoalSchema)
