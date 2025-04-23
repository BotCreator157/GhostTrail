// src/utils/ethFeeUtil.js
const ethers = require('ethers');

async function fetchBaseGasPrice(provider) {
  return provider.getGasPrice(); // BigNumber
}

// Randomize ±10–15%
function randomizeGasPrice(basePrice) {
  const variance = Math.floor(Math.random() * 6) + 10; // 10–15%
  return basePrice.mul(100 + variance).div(100);
}

module.exports = { fetchBaseGasPrice, randomizeGasPrice };
