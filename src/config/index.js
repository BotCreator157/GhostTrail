// src/config.js
module.exports = {
  PORT:             process.env.PORT,
  MONGODB_URI:      process.env.MONGODB_URI,
  ETH_RPC_URL:      process.env.ETH_RPC_URL,
  ETH_PRIVATE_KEY:  process.env.ETH_PRIVATE_KEY,
  HOT_WALLET_ADDRESS: process.env.HOT_WALLET_ADDRESS,
  TRONSCAN_API_KEY: process.env.TRONSCAN_API_KEY,
  TRON_PRIVATE_KEY: process.env.TRON_PRIVATE_KEY,
  MONERO_RPC_URL:   process.env.MONERO_RPC_URL,
  // …any others you use
};