const axios = require('axios');
const config = require('../config');
module.exports = axios.create({
  baseURL: 'https://api.shasta.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': config.TRONSCAN_API_KEY }
});
