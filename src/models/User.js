const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  telegramId: { type: String, required: true, index: true },
  hash: { type: String, unique: true, required: true },
  salt: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);