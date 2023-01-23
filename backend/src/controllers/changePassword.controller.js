import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const saltRounds = 10;

const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const {oldPassword, securityQuestions, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ status: "error", error: "User not found" });
      const match = await bcrypt.compare(oldPassword.toString(), user.password);
      if (!match) {
        return res.status(401).json({ status: "error", error: "Invalid old password" });
      }
    let securityQuestionsAnsweredCorrectly = 0;
    for (let i = 0; i < securityQuestions.length; i++) {
      const question = securityQuestions[i].question;
      const answer = securityQuestions[i].answer;
      const userQuestion = user.securityQuestions.find(
        (q) => q.question === question
      );
      if (!userQuestion) continue;
      const userAnswer = userQuestion.answer;
      if (answer === userAnswer) {
        securityQuestionsAnsweredCorrectly++;
      }
    }
    if (securityQuestionsAnsweredCorrectly < 2) {
      return res.status(401).json({
        status: "error",
        error: "You have not answered the security questions correctly",
      });
    }

    const lastFivePasswords = user.passwordHistory.slice(0, 5);
    for (let i = 0; i < lastFivePasswords.length; i++) {
      const match = await bcrypt.compare(
        newPassword.toString(),
        lastFivePasswords[i].hashedPassword
      );
      if (match) {
        return res.status(401).json({
          status: "error",
          error: "New password is in the last five passwords",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(
      newPassword.toString(),
      saltRounds
    );

    await User.updateOne(
      { _id: userId },
      {
        $set: { password: hashedPassword },
        $set: { password: hashedPassword, attempts: 0 },
        $push: { passwordHistory: { hashedPassword, createdAt: Date.now() } },
      }
    );

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
};

export default { changePassword };
