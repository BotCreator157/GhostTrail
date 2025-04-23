const moneroRpc = require('../../integrations/moneroRpcClient');
const { fetchFeePerKB } = require('../../utils/moneroFeeUtil');

async function generateSubaddress(userHash) {
  const res = await moneroRpc.post('/', {
    jsonrpc: '2.0',
    id: '0',
    method: 'create_address',
    params: { account_index: 0 }
  });
  return res.data.result.address;
}

async function sendTransaction(fromAcctIndex, to, amount) {
  // 1) estimate fee
  const feePerKB = await fetchFeePerKB();
  // 2) Monero RPC transfer call
  const res = await moneroRpc.post('/', {
    jsonrpc: '2.0',
    id: '0',
    method: 'transfer',
    params: [{
      account_index: fromAcctIndex,
      address: to,
      amount: Math.floor(Number(amount) * 1e12), // atomic units
      fee: feePerKB
    }]
  });
  return res.data.result.tx_hash;
}

module.exports = {
  generateSubaddress,
  sendTransaction,
};
