// src/bot/index.js
require('dotenv').config()

// detect whether this module was run directly, or only required
const isMain = require.main === module;

const { Telegraf, Markup } = require('telegraf')
const { session }          = require('./middlewares/session')
const express              = require('express')
const { languageKeyboard } = require('./keyboards/languageKeyboard')
const { mainMenuKeyboard } = require('./keyboards/mainMenuKeyboard')
const { transferScene }    = require('./scenes/transferScene')
const { apiClient }        = require('./utils/apiClient')
const { generateQRBuffer } = require('./utils/qr')
const { t }                = require('./utils/localization')
const { handleApiError }   = require('./utils/errorHandler')
const { hashUserId }       = require('./utils/hashUtil')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

// ─── MIDDLEWARE ────────────────────────────────────────────────
bot.use(session())
bot.use(async (ctx, next) => {
  ctx.session = ctx.session || {}
  ctx.session.language = ctx.session.language || ctx.from.language_code || 'en'
  ctx.session.userId   = ctx.session.userId   || hashUserId(ctx.from.id)
  await next()
})


  // ─── GLOBAL CANCEL ESCAPE ─────────────────────────────────────
  // If the user types /cancel or presses a "cancel" button,
  // wipe out any in-flight session state and go back to main menu.
  bot.command('cancel', async (ctx) => {
    ctx.session.transfer = null
    // also clear any other session flags here...
    return ctx.reply(
      t(ctx.session.language, 'operation_cancelled'),
      mainMenuKeyboard
    )
  })
  bot.action('cancel', async (ctx) => {
    ctx.session.transfer = null
    return ctx.reply(
      t(ctx.session.language, 'operation_cancelled'),
      mainMenuKeyboard
    )
  })

// ─── START & LANGUAGE ────────────────────────────────────────────
bot.start(async (ctx) => {
  await ctx.reply(t(ctx.session.language, 'welcome'), languageKeyboard)
})

bot.action(/lang_(en|zh|vi|th|ja|ko)/, async (ctx) => {
  ctx.session.language = ctx.match[1]
  await ctx.reply(t(ctx.session.language, 'welcome'), mainMenuKeyboard)
})

// ─── HOME MENU ──────────────────────────────────────────────────
bot.action('home', async (ctx) => {
  ctx.session.transfer = null;

  // 1) Send your existing Home menu immediately
  await ctx.reply(
    t(ctx.session.language, 'home_menu'),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('▶️ New BTC', 'home_BTC'),
        Markup.button.callback('▶️ New ETH', 'home_ETH'),
        Markup.button.callback('▶️ New TRX', 'home_TRX')
      ],
      [
        Markup.button.callback('📋 View All',    'view_addresses'),
        Markup.button.callback('🗑️ Delete One', 'delete_address')
      ]
    ])
  );

  // 2) Then fetch & list all deposit addresses + balances
  try {
    const res   = await apiClient.get(`/addresses/${ctx.session.userId}`);
    const addrs = Array.isArray(res.data)
      ? res.data
      : res.data.addresses || [];

    if (addrs.length) {
      let list = t(ctx.session.language, 'your_addresses_count', { count: addrs.length }) + '\n\n';
      for (const a of addrs) {
        let bal = 'unavailable';
        try {
          const b = await apiClient.get(
            `/balances/${encodeURIComponent(a.address)}`,
            { params: { currency: a.currency } }
          );
          bal = b.data.balance ?? 0;
        } catch {
          /* ignore balance errors */
        }
        list += `• ${a.currency}: ${a.address}\n  Balance: ${bal}\n\n`;
      }
      // send the composite list message
      await ctx.reply(list.trim());
    }
  } catch (err) {
    console.warn('Home view – could not fetch addresses:', err);
  }
});


bot.action(/home_(BTC|ETH|TRX)/, async (ctx) => {
  ctx.session.transfer = null
  const currency = ctx.match[1]
  try {
    const postRes = await apiClient.post('/deposits', {
      userHash: ctx.session.userId,
      currency,
      amount: '0'
    })
    const addr = postRes.data.address
    const qr   = generateQRBuffer(addr)
    await ctx.replyWithPhoto(
      { source: qr },
      { caption: `${currency} Deposit Address:\n${addr}` }
    )
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

bot.action('view_addresses', async (ctx) => {
  ctx.session.transfer = null
  try {
    const res   = await apiClient.get(`/addresses/${ctx.session.userId}`)
    const addrs = Array.isArray(res.data)
      ? res.data
      : res.data.addresses || []

    if (!addrs.length) {
      return await ctx.reply(t(ctx.session.language, 'no_addresses'))
    }

    await ctx.reply(
      t(ctx.session.language, 'your_addresses_count', { count: addrs.length })
    )

    for (const a of addrs) {
      let msg = `• ${a.currency}: ${a.address}`

      // ─── BALANCE CHECK ───────────────────────────────────
      try {
        const balRes = await apiClient.get(
          `/balances/${encodeURIComponent(a.address)}`,
          { params: { currency: a.currency } }
        )
        if (balRes.data.balance != null) {
          msg += `\nBalance: ${balRes.data.balance}`
        }
      } catch {
        // ignore if endpoint missing or error
      }

      await ctx.reply(msg)
    }
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

bot.action('delete_address', async (ctx) => {
  ctx.session.transfer = null
  try {
    const res   = await apiClient.get(`/addresses/${ctx.session.userId}`)
    const addrs = Array.isArray(res.data)
      ? res.data
      : res.data.addresses || []

    if (!addrs.length) {
      return await ctx.reply(t(ctx.session.language, 'no_addresses'))
    }

    const buttons = addrs.map(a => [
      Markup.button.callback(
        `${a.currency}: ${a.address.slice(0,6)}…`,
        `delete_${encodeURIComponent(a.address)}`
      )
    ])

    await ctx.reply(
      t(ctx.session.language, 'select_address_delete'),
      Markup.inlineKeyboard(buttons)
    )
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

bot.action(/delete_(.+)/, async (ctx) => {
  const address = decodeURIComponent(ctx.match[1])
  try {
    await apiClient.delete(`/addresses/${address}`)
    await ctx.reply(t(ctx.session.language, 'address_deleted'))
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

// ─── PORTFOLIO ──────────────────────────────────────────────────
bot.action('portfolio', async (ctx) => {
  ctx.session.transfer = null
  try {
    const res = await apiClient.get(`/portfolio/${ctx.session.userId}`)
    if (!Array.isArray(res.data) || !res.data.length) {
      return await ctx.reply(t(ctx.session.language, 'no_transactions'))
    }
    for (const tx of res.data) {
      await ctx.reply(`💸 ${tx.currency}: ${tx.amount} to ${tx.destination}`)
    }
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

// ─── EXPLORE ────────────────────────────────────────────────────
bot.action('explore', async (ctx) => {
  ctx.session.transfer = null
  try {
    const res   = await apiClient.get('/explore')
    const coins = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data.chains)
        ? res.data.chains
        : []

    if (!coins.length) {
      return await ctx.reply(t(ctx.session.language, 'error'))
    }
    await ctx.reply('Supported coins:\n' + coins.map(c => `- ${c}`).join('\n'))
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

// ─── TRANSFER ────────────────────────────────────────────────────
// 1) Entry: ask currency
bot.action('transfer', transferScene)

// 2) Currency selected → list your addresses + balances
bot.action(/currency_(ETH|TRX|BTC)/, async (ctx) => {
  const currency = ctx.match[1]
  ctx.session.transfer = { currency, step: 'awaiting_source' }

  try {
    // fetch & filter your deposit addresses
    const res = await apiClient.get(`/addresses/${ctx.session.userId}`)
    const addrs = (Array.isArray(res.data) ? res.data : res.data.addresses || [])
                   .filter(a => a.currency === currency)
    if (!addrs.length) {
      return ctx.reply(t(ctx.session.language, 'no_addresses'))
    }

    // build the list message & inline buttons
    let list = t(ctx.session.language, 'choose_source_address') + '\n\n'
    const buttons = []
    for (const a of addrs) {
      let bal = 'unavailable'
      try {
        const b = await apiClient.get(
          `/balances/${encodeURIComponent(a.address)}`,
          { params: { currency } }
        )
        bal = b.data.balance ?? 0
      } catch { /* ignore */ }

      list += `• ${a.address}\n  Balance: ${bal}\n\n`
      buttons.push(
        Markup.button.callback(
          a.address.slice(0,6) + '…',
          `source_${encodeURIComponent(a.address)}`
        )
      )
    }

    // send list, then keyboard
    await ctx.reply(list.trim())
    await ctx.reply(
      t(ctx.session.language, 'select_source_address'),
      Markup.inlineKeyboard(buttons.map(b => [b]))
    )
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

// 3) Source address chosen
bot.action(/source_(.+)/, async (ctx) => {
  const source = decodeURIComponent(ctx.match[1])
  ctx.session.transfer.source = source
  ctx.session.transfer.step   = 'awaiting_destination'

  await ctx.reply(t(ctx.session.language, 'enter_destination'))
})

// 4) Destination address pasted → estimate fee
bot.on('text', async (ctx) => {
  const tf = ctx.session.transfer
  if (tf?.step !== 'awaiting_destination') return

  tf.destination = ctx.message.text.trim()
  tf.step        = 'confirming'

  try {
    const feeRes = await apiClient.get(`/fees/${tf.currency}`)
    tf.fee = feeRes.data.fee

    await ctx.reply(
      t(ctx.session.language, 'estimated_fee', { fee: tf.fee }),
      Markup.inlineKeyboard([
        [ Markup.button.callback(t(ctx.session.language, 'yes'), 'confirm_yes'),
          Markup.button.callback(t(ctx.session.language, 'no'),  'confirm_no') ],
        [ Markup.button.callback('❌ Cancel', 'cancel_global') ]
      ])
    )
  } catch (err) {
    await handleApiError(ctx, err)
  }
})

// 5) Confirmation handlers
bot.action('confirm_yes', async (ctx) => {
  const tf = ctx.session.transfer
  try {
    const res = await apiClient.post('/withdrawals', {
      userHash: ctx.session.userId,
      currency: tf.currency,
      address:  tf.destination,
      amount:   tf.amount  // if you need to prompt for amount, add that step
    })
    const qr = generateQRBuffer(res.data.proofUrl)
    await ctx.replyWithPhoto(
      { source: qr },
      { caption: `${t(ctx.session.language, 'withdrawal_success')}\n\nProof: ${res.data.proofUrl}` }
    )
  } catch (err) {
    await handleApiError(ctx, err)
  } finally {
    ctx.session.transfer = null
  }
})

bot.action('confirm_no', async (ctx) => {
  ctx.session.transfer = null
  await ctx.reply(t(ctx.session.language, 'transfer_cancelled'), mainMenuKeyboard)
})

// ─── LAUNCH / WEBHOOK (only if run directly) ────────────────────
if (isMain) {
  // If in production, set up webhook & serve via Express
  if (process.env.NODE_ENV === 'production') {
    const APP_URL = (process.env.APP_URL||'').replace(/\/+$/,'')
    bot.telegram.setWebhook(`${APP_URL}/telegraf/webhook`)

    const app = express()
    app.use(bot.webhookCallback('/telegraf/webhook'))
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } else {
    // local/dev polling
    bot.launch()
    console.log('🤖 GhostTrail Bot is running locally (polling)!')
  }
}

// Export the configured bot so other scripts can require() it
module.exports = bot
