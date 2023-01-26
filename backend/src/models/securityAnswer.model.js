import mongoose from "mongoose";

const SecurityAnswersSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  });
  
  export default mongoose.model("SecurityAnswers", SecurityAnswersSchema);