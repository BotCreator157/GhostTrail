const axios = require('axios');
const config = require('../config');
module.exports = axios.create({
  baseURL: `https://api.blockcypher.com/v1/btc/signet`,
  params: { token: config.BLOCKCYPHER_API_KEY }
});