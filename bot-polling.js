// bot-polling.js
require('dotenv').config();
// import the same bot you’ve already built
const bot = require('./src/bot/index.js');

// launch in polling mode
bot.launch()
  .then(()=> console.log('🤖 Bot started in polling mode'))
  .catch(err => {
    console.error('Failed to launch bot:', err);
    process.exit(1);
  });
