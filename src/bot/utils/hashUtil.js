// src/bot/utils/hashUtil.js
const crypto = require('crypto')

function hashUserId(userId) {
  return crypto.createHash('sha256').update(String(userId)).digest('hex')
}

module.exports = { hashUserId }
