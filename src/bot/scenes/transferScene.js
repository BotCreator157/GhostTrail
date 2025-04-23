// src/bot/scenes/transferScene.js
const { Markup } = require('telegraf')
const { t }        = require('../utils/localization')

async function transferScene(ctx) {
  // initialize the flow
  ctx.session.transfer = { step: 'awaiting_currency' }

  // show all three currencies (include BTC if you want)
  await ctx.reply(
    t(ctx.session.language, 'choose_currency'),
    Markup.inlineKeyboard([
      [ Markup.button.callback('ETH', 'currency_ETH') ],
      [ Markup.button.callback('TRX', 'currency_TRX') ],
      [ Markup.button.callback('BTC', 'currency_BTC') ]
    ])
  )
}

module.exports = { transferScene }