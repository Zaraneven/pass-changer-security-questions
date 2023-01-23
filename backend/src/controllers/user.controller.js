import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/user.model.js";

const saltRounds = 10;

const register = async (req, res) => {
  const { name, email, password, securityQuestions } = req.body;

  const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    securityQuestions,
    passwordHistory: [{ hashedPassword, createdAt: Date.now() }],
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ savedUser, id: savedUser._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ status: "error", error: "User not found" });
    return res.status(200).json({ status: "ok", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ status: "error", error: "Invalid email or password" });

    const match = await bcrypt.compare(password.toString(), user.password);
    if (!match) {
      user.incAttempts(password);
      if (user.attempts >= 2) {
        user.accountLocked = true;
        await user.save();
        return res
          .status(401)
          .json({
            status: "error",
            error:
              "Too many login attempts. Account locked. Please reset your password.",
              
          });
      }
      return res
        .status(401)
        .json({ status: "error", error: "Invalid email or password" });
    }
    if (user.accountLocked) {
      return res
        .status(401)
        .json({
          status: "error",
          error: "Account is locked. Please reset your password.",
        });
    }

    user.resetAttempts();
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: "1h",
    });
    res.status(200).json({ status: "ok", token, id: user._id });
  } catch (err) {
    console.error(err);
    res
      .status(err.response.status)
      .json({ status: "error", error: err.response.data });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { securityQuestions, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ status: "error", error: "User not found" });
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
          error: "Newpassword is in the last five passwords",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(
      newPassword.toString(),
      saltRounds
    );

    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $set: { password: hashedPassword, attempts: 0, accountLocked: false },
        $push: { passwordHistory: { hashedPassword, createdAt: Date.now() } },
      }
    );

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email, securityQuestions, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "error", error: "Invalid email" });
    }

    let isMatch = true;
    securityQuestions.forEach((question) => {
      const userQuestion = user.securityQuestions.find(
        (q) => q.question === question.question
      );
      if (!userQuestion || userQuestion.answer !== question.answer) {
        isMatch = false;
      }
    });
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", error: "Incorrect security answers" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

export default { register, login, getUser, resetPassword, forgetPassword };
