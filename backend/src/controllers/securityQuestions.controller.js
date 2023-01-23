import SecurityQuestion from "../models/securQuest.model.js";
import User from "../models/user.model.js";

const getSecurityQuestions = async (req, res) => {
  try {
    const defaultQuestions = [
      { question: "What is the name of your favorite childhood friend?" },
      { question: "What time of the day were you born?" },
      { question: "What was your dream job as a child?" },
      { question: "What is the street number of the house you grew up in?" },
      { question: "Who was your childhood hero?" },
    ];
    const questions = await SecurityQuestion.find();
    const allQuestions = [...defaultQuestions, ...questions];
    return res.json({ status: "ok", questions: allQuestions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", error: "server error" });
  }
};

const updateSecurityQuestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const securityQuestions = req.body.securityQuestions;
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { securityQuestions, securityQuestionsAnswered: true } }
    );
    return res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", error: "server error" });
  }
};

export default { getSecurityQuestions, updateSecurityQuestions };
