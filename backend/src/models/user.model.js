import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  securityQuestionsAnswered: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.methods.incAttempts = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  if (!match && !this.accountLocked) {
    this.attempts += 1;
    if (this.attempts >= 3) {
      this.accountLocked = true;
    }
    await this.save();
  }
};
UserSchema.methods.resetAttempts = async function () {
  if (this.accountLocked) {
    this.attempts = 0;
    this.accountLocked = false;
    await this.save();
  }
};

UserSchema.methods.compareSecurityQuestions = async function (submittedAnswers) {
  let correctAnswers = 0;
  for (let i = 0; i < submittedAnswers.length; i++) {
    const submittedAnswer = submittedAnswers[i];
    const dbAnswer = await SecurityAnswers.findOne({ question: submittedAnswer.question, user: this._id});
    if (dbAnswer && dbAnswer.answer === submittedAnswer.answer) {
      correctAnswers++;
    }
  }
  return correctAnswers >= 2;
};

UserSchema.methods.resetPassword = function (newPassword) {
  this.password = newPassword;
  this.attempts = 0;
  this.accountLocked = false;
};
export default mongoose.model("User", UserSchema);