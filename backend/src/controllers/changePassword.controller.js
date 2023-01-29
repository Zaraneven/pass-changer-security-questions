import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import PasswordHistory from '../models/passwordHistory.model.js'

const saltRounds = 10;

const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const {oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ status: "error", error: "User not found" });
    const match = await bcrypt.compare(oldPassword.toString(), user.password);
    if (!match) {
      return res.status(401).json({ status: "error", error: "Invalid old password" });
    }
    

    const passwordHistory = await PasswordHistory.findOne({ user: user._id });
const lastFivePasswords = passwordHistory.hpasswords.slice(0, 5);
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

  await PasswordHistory.updateOne(
    { _id: passwordHistory._id },
    {
    $push: { hpasswords: { hashedPassword, createdAt: Date.now() } },
    }
    );

    await User.updateOne(
      { _id: userId },
      {
        $set: { password: hashedPassword },
        $set: { password: hashedPassword, attempts: 0 },
        
      }
    );

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", error: "Server error" });
  }
};

export default { changePassword };
