// src/bot/keyboards/mainMenuKeyboard.js
const { Markup } = require('telegraf')

const mainMenuKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('🏠 Home', 'home')],
  [Markup.button.callback('💼 Portfolio', 'portfolio')],
  [Markup.button.callback('🔎 Explore', 'explore')],
  [Markup.button.callback('💸 Transfer', 'transfer')]
])

module.exports = { mainMenuKeyboard }