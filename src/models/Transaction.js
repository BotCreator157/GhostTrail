const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userHash: { type: String, required: true, index: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['deposit','withdrawal'], required: true },
  address: { type: String, required: true },
  amount: { type: String, required: true },
  metadata: { type: String, required: true }, // encrypted
  createdAt: { type: Date, default: Date.now, index: { expires: '24h' } },
});

module.exports = mongoose.model('Transaction', TransactionSchema);