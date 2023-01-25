import mongoose from "mongoose";

const SecurityQuestionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
});

export default mongoose.model("SecurityQuestion", SecurityQuestionsSchema);
