// src/bot/keyboards/languageKeyboard.js
const { Markup } = require('telegraf')

const languageKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('English 🇬🇧', 'lang_en')],
  [Markup.button.callback('中文 🇨🇳', 'lang_zh')],
  [Markup.button.callback('Tiếng Việt 🇻🇳', 'lang_vi')],
  [Markup.button.callback('ไทย 🇹🇭', 'lang_th')],
  [Markup.button.callback('日本語 🇯🇵', 'lang_ja')],
  [Markup.button.callback('한국어 🇰🇷', 'lang_ko')]
])

module.exports = { languageKeyboard }