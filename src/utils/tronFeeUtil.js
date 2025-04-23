// src/utils/tronFeeUtil.js
// Tron bandwidth/energy is often free if staked—but if not, you can estimate:
async function estimateFee(tronWeb) {
    // .getTransactionFee might not exist—TronWeb uses bandwidth; for now:
    return 0; // placeholder — you’ll top up/stake before mainnet
  }
  
  module.exports = { estimateFee };
  