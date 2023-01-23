import mongoose from "mongoose";

const SecurityQuestionsSchema = new mongoose.Schema({
  securityQuestions: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("SecurityQuestion", SecurityQuestionsSchema);
