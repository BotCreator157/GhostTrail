const ethers = require('ethers');
const config = require('../../config');
const { fetchBaseGasPrice, randomizeGasPrice } = require('../../utils/ethFeeUtil');


// We’ll create provider & wallet *inside* sendTransaction to avoid require‑time failures

async function generateAddress(userHash) {
  const walletRandom = ethers.Wallet.createRandom();
  return walletRandom.address;
}

async function sendTransaction(from, to, amount) {
    // ☝️ lazy‑init your provider & wallet here
const provider = new ethers.providers.JsonRpcProvider(config.ETH_RPC_URL);
const wallet   = new ethers.Wallet(config.ETH_PRIVATE_KEY, provider);


  // 1) fetch & randomize gas price
  const basePrice = await fetchBaseGasPrice(provider);
  const gasPrice = randomizeGasPrice(basePrice);

  // 2) build tx
  const tx = {
    to,
    value: ethers.utils.parseEther(amount),
    gasPrice,
    gasLimit: 21_000, // simple transfer
  };

  // 3) send & wait for hash
  const response = await wallet.sendTransaction(tx);
  await response.wait();
  return response.hash;
}

module.exports = {
  generateAddress,
  sendTransaction,
};