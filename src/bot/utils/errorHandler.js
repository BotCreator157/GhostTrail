// src/bot/utils/errorHandler.js
const { t } = require('./localization')

const handleApiError = async (ctx, error) => {
  console.error('API Error:', error?.response?.data || error.message)

  await ctx.reply(t(ctx.session.language, 'error'))
}

module.exports = { handleApiError }
