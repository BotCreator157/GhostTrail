const bitcoin = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').ECPairFactory;
const ecc = require('tiny-secp256k1');
const axios = require('axios');
const { fetchRecommendedFeeRate, calculateFee } = require('../../utils/btcFeeUtil');

// Proper ECPair setup
const ECPair = ECPairFactory(ecc);

async function generateAddress(userHash) {
  const keyPair = ECPair.makeRandom();
  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(keyPair.publicKey)
  });
  return address;
}

async function sendTransaction(fromWIF, toAddress, amount) {
  // 1) decode fromWIF, fetch UTXOs, build a PSBT, etc.
  //    (Use your preferred UTXO provider / node here; below is a placeholder)
  const keyPair = ECPair.fromWIF(fromWIF);
  const psbt = new bitcoin.Psbt();

  // -- Fetch UTXOs and add inputs
  // const utxos = await fetchUtxos(fromAddress)
  // utxos.forEach(u => psbt.addInput({ ... }))

  // -- Add output
  const sats = Math.floor(Number(amount) * 1e8);
  psbt.addOutput({ address: toAddress, value: sats });

  // 2) estimate fee
  const satsPerVByte = await fetchRecommendedFeeRate();
  const vbytes = psbt.__CACHE ? psbt.__CACHE.unsignedTx.virtualSize() : 250; // rough estimate
  const fee = calculateFee(vbytes, satsPerVByte);

  // 3) subtract fee from the largest output or add change output
  // (omitted for brevity)

  // 4) sign & finalize
  psbt.signAllInputs(keyPair);
  psbt.finalizeAllInputs();
  const raw = psbt.extractTransaction().toHex();

  // 5) broadcast (placeholder)
  // const { data } = await axios.post('https://your-node.example/sendrawtransaction', { rawtx: raw });
  // return data.txid;

  return 'signed-tx-hex-or-id-placeholder';
}

module.exports = {
  generateAddress,
  sendTransaction,
};
