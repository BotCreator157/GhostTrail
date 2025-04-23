// src/controllers/balancesController.js
const Boom        = require('@hapi/boom');
const { ethers }  = require('ethers');
const TronWeb     = require('tronweb');
const bitcoin     = require('bitcoinjs-lib');
const axios       = require('axios');
const moneroRpc   = require('../integrations/moneroRpcClient');
const catchAsync  = require('../utils/catchAsync');

// ETH provider
const ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
// TronWeb (Shasta)
const tronWeb = new TronWeb({
  fullNode:     process.env.TRON_FULL_NODE,
  solidityNode: process.env.TRON_SOLIDITY_NODE  || process.env.TRON_FULL_NODE,
  eventServer:  process.env.TRON_EVENT_SERVER   || process.env.TRON_FULL_NODE,
  privateKey:   process.env.TRON_PRIVATE_KEY
});

function validateCurrency(cur) {
  const SUPPORTED = ['ETH','TRX','BTC','XMR'];
  if (!SUPPORTED.includes(cur)) {
    throw Boom.badRequest('Unsupported or missing ?currency= (must be one of ETH, TRX, BTC, XMR)');
  }
}
function validateAddress(addr, currency) {
  switch (currency) {
    case 'ETH': if (!ethers.utils.isAddress(addr)) throw Boom.badRequest('Invalid ETH address'); break;
    case 'TRX': if (!TronWeb.isAddress(addr)) throw Boom.badRequest('Invalid TRX address'); break;
    case 'BTC':
        try {
          // Changed to validate against mainnet addresses
          bitcoin.address.toOutputScript(addr, bitcoin.networks.bitcoin);
        } catch (_) {
          throw Boom.badRequest('Invalid BTC address provided');
        }
        break;
    case 'XMR': if (!/^4[0-9AB][1-9A-Za-z]{93}$/.test(addr)) throw Boom.badRequest('Invalid XMR address'); break;
  }
}

async function getEthBalance(addr) { const raw = await ethProvider.getBalance(addr); return parseFloat(ethers.utils.formatEther(raw)); }
async function getTrxBalance(addr) { const sun = await tronWeb.trx.getBalance(addr); return sun / 1e6; }
async function getBtcBalance(addr) {
    try {
      const { data } = await axios.get(
        `https://api.blockcypher.com/v1/btc/signet/addrs/${addr}/balance`,
        { params:{ token: process.env.BLOCKCYPHER_API_KEY } }
      );
      return data.balance / 1e8;
    } catch (err) {
      if (err.response?.status === 404) {
        return 0;
      }
      throw err;
    }
  }
async function getXmrBalance(addr) { const r = await moneroRpc.post('/', { jsonrpc:'2.0', id:'0', method:'get_address_balance', params:{ address: addr }}); return r.data.result.balance/1e12; }

exports.getBalance = catchAsync(async (req, res, next) => {
  const { address } = req.params;
  const currency    = (req.query.currency||'').toUpperCase();
  validateCurrency(currency);
  validateAddress(address,currency);
  let balance;
  switch(currency) {
    case 'ETH': balance = await getEthBalance(address); break;
    case 'TRX': balance = await getTrxBalance(address); break;
    case 'BTC': balance = await getBtcBalance(address); break;
    case 'XMR': balance = await getXmrBalance(address); break;
  }
  res.json({ address, currency, balance });
});