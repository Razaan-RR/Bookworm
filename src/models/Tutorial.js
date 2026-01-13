import mongoose from 'mongoose'

const TutorialSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    title: { type: String, required: true }, // tutorial title
    youtubeUrl: { type: String, required: true }, // YouTube video link
    description: { type: String }, // optional description
  },
  { timestamps: true }
)

const Tutorial =
  mongoose.models.Tutorial || mongoose.model('Tutorial', TutorialSchema)
export default Tutorial
