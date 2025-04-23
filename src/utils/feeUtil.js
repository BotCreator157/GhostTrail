// src/utils/feeUtil.js
const { utils } = require('ethers');
const { formatEther, parseEther } = utils;

/**
 * Take a real fee (in wei, BigNumber), round to nearest 0.01 ETH,
 * then apply ±1% random noise, and return a string like "0.12 ETH".
 */
function obfuscateFeeDisplay(realWei) {
  // 1) convert wei → ETH as number
  const realEth = parseFloat(formatEther(realWei));
  // 2) round to nearest 0.01
  const rounded = Math.round(realEth * 100) / 100;
  // 3) apply ±1% noise
  const factor = 1 + (Math.random() * 0.02 - 0.01);
  const obf = rounded * factor;
  // always show two decimals
  return `${obf.toFixed(2)} ETH`;
}

module.exports = { obfuscateFeeDisplay };