import SecurityQuestion from "../models/securQuest.model.js";
import User from "../models/user.model.js";
import SecurityAnswers from '../models/securityAnswer.model.js';

const getSecurityQuestions = async (req, res) => {
  try {
    const questions = await SecurityQuestion.find();
    
    const allQuestions = [...questions];
    res.json({ questions: allQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSecurityQuestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const securityQuestions = req.body.securityQuestions;
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { securityQuestionsAnswered: true } }
    );
    
    const securityAnswers = securityQuestions.map((question) => {
      return {
        user: userId,
        question: question.question,
        answer: question.answer
      }
    });
    await SecurityAnswers.insertMany(securityAnswers);
    return res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", error: "server error" });
  }
};

export default { getSecurityQuestions, updateSecurityQuestions };
