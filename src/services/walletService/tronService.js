const TronWeb = require('tronweb');
const { estimateFee } = require('../../utils/tronFeeUtil');

const tronWeb = new TronWeb({
  fullHost: 'https://api.shasta.trongrid.io',
  privateKey: process.env.TRON_PRIVATE_KEY
});

async function generateAddress(userHash) {
  // corrected API call
  const account = await tronWeb.createAccount();
  return account.address.base58;
}

async function sendTransaction(from, to, amount) {
  // 1) estimate fee (often zero if bandwidth is staked)
  const fee = await estimateFee(tronWeb);

  // 2) build & sign transaction
  const tx = await tronWeb.transactionBuilder.sendTrx(to, tronWeb.toSun(amount), from);
  const signed = await tronWeb.trx.sign(tx);
  // 3) broadcast
  const receipt = await tronWeb.trx.sendRawTransaction(signed);
  return receipt.transaction.txID;
}

module.exports = {
  generateAddress,
  sendTransaction,
};
