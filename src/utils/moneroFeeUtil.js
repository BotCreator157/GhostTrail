// src/utils/moneroFeeUtil.js
const moneroRpc = require('../integrations/moneroRpcClient');

async function fetchFeePerKB() {
  const res = await moneroRpc.post('/', {
    jsonrpc: '2.0',
    id: '0',
    method: 'get_fee_estimate',
    params: []
  });
  return res.data.result.fee; // atomic units per kB
}

module.exports = { fetchFeePerKB };
