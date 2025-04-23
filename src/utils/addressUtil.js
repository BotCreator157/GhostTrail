// src/utils/addressUtil.js
/**
 * Given an array of addresses, pick one at random
 * @param {string[]} addressList
 * @returns {string}
 */
function selectRandomWithdrawalAddress(addressList) {
    const idx = Math.floor(Math.random() * addressList.length);
    return addressList[idx];
  }
  
  module.exports = { selectRandomWithdrawalAddress };
  