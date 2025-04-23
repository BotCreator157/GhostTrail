const axios = require('axios');
const config = require('../config');
module.exports = axios.create({
  baseURL: config.MONERO_RPC_URL,
  headers: { 'Content-Type': 'application/json' }
});
