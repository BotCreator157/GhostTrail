// src/utils/gasUtil.js

/**
 * Fetches the current gas price from the provider,
 * then applies a random ±10–15% variance.
 */
async function applyRandomGasPrice(provider) {
    const base = await provider.getGasPrice();
    // pick a random variance between +10% and +15%
    const variancePct = 10 + Math.floor(Math.random() * 6);
    // gasPrice = base * (100 + variancePct) / 100
    return base.mul(100 + variancePct).div(100);
  }
  
  module.exports = { applyRandomGasPrice };