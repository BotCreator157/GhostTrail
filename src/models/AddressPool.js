const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressPoolSchema = new Schema({
  userHash: { type: String, required: true },
  currency: { type: String, required: true },
  address: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('AddressPool', AddressPoolSchema);