// src/utils/btcFeeUtil.js
const axios = require('axios');

async function fetchRecommendedFeeRate() {
  // e.g. from a public API like mempool.space
  const { data } = await axios.get('https://mempool.space/api/v1/fees/recommended');
  return data.fastestFee; // sats/vByte
}

function calculateFee(vbytes, satsPerVByte) {
  return Math.ceil(vbytes * satsPerVByte);
}

module.exports = { fetchRecommendedFeeRate, calculateFee };
