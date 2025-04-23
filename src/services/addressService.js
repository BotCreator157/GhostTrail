const AddressPool = require('../models/AddressPool');
const crypto = require('crypto');
const config = require('../config');
const { generateAddress: genBTC } = require('./walletService/btcService');
const { generateAddress: genETH } = require('./walletService/ethService');
const { generateAddress: genTRON } = require('./walletService/tronService');
const { generateSubaddress: genXMR } = require('./walletService/moneroService');

async function createDepositAddress(userHash, currency) {
  let address;
  switch(currency) {
    case 'BTC': address = await genBTC(userHash); break;
    case 'ETH': address = await genETH(userHash); break;
    case 'TRX':      // ← add this line
    case 'TRON':
       address = await genTRON(userHash)
       break
    case 'XMR': address = await genXMR(userHash); break;
    default: throw Object.assign(new Error('Unsupported currency'),{ status:400 });
  }
  const expiresAt = new Date(Date.now()+24*60*60*1000);
  await AddressPool.create({ userHash, currency, address, expiresAt });
  return address;
}

module.exports = { createDepositAddress };