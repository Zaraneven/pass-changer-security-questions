import mongoose from "mongoose";

const SecurityAnswersSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SecurityQuestion', required: true },
      answer: { type: String, required: true }
  }]
  });
  
  export default mongoose.model("SecurityAnswers", SecurityAnswersSchema);