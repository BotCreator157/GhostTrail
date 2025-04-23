const Transaction = require('../models/Transaction');
const { encrypt } = require('../utils/encryptUtil');

async function recordTransaction(userHash, currency, type, address, amount, metadataObj) {
  const metadata = encrypt(JSON.stringify(metadataObj));
  return Transaction.create({ userHash, currency, type, address, amount, metadata });
}

module.exports = { recordTransaction };