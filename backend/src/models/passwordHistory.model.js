import mongoose from 'mongoose';

const PasswordHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hpasswords: [{ hashedPassword: { type: String }, createdAt: { type: Date } }]
});

export default mongoose.model('PasswordHistory', PasswordHistorySchema); 