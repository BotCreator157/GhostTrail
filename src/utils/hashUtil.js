const crypto = require('crypto');

function genSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hash(telegramId, salt) {
  return crypto.createHash('sha256').update(telegramId + salt).digest('hex');
}

module.exports = { genSalt, hash };
