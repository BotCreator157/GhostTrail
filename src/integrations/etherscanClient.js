const axios = require('axios');
const config = require('../config');
module.exports = axios.create({
  baseURL: 'https://api-sepolia.etherscan.io/api',
  params: { apikey: config.ETHERSCAN_API_KEY }
});