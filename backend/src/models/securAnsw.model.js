import mongoose, { Schema } from "mongoose";

const SecurityAnswerSchema = new  mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: "SecurityQuestion", required: true },
    answer: { type: String, required: true }
})

export default mongoose.model("SecurityAnswers", SecurityAnswerSchema);  