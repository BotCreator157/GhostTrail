// src/bot/utils/qr.js
const qr = require('qr-image')

const generateQRBuffer = (text) => {
  return qr.imageSync(text, { type: 'png' })
}

module.exports = { generateQRBuffer }