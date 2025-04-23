// src/controllers/feesController.js

const Boom   = require('@hapi/boom');
const { ethers } = require('ethers');
const {
  fetchBaseGasPrice,
  randomizeGasPrice
} = require('../utils/ethFeeUtil');
const { estimateFee: tronEstimate }      = require('../utils/tronFeeUtil');
const {
  fetchRecommendedFeeRate,
  calculateFee
} = require('../utils/btcFeeUtil');
const { fetchFeePerKB } = require('../utils/moneroFeeUtil');

function validateCurrency(cur) {
  const SUPPORTED = ['ETH','TRX','BTC','XMR'];
  if (!SUPPORTED.includes(cur)) {
    throw Boom.badRequest(
      'Unsupported currency (must be one of ETH, TRX, BTC, XMR)'
    );
  }
}

exports.getFee = async (req, res, next) => {
  try {
    const currency = (req.params.currency || '').toUpperCase();
    validateCurrency(currency);

    let fee;
    switch (currency) {
      case 'ETH': {
        const provider   = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
        const base       = await fetchBaseGasPrice(provider);
        const randomized = randomizeGasPrice(base);
        fee = parseFloat(ethers.utils.formatEther(randomized));
        break;
      }
      case 'TRX':
        try {
            fee = 0;
        } catch (_) {
          throw Boom.internal('Failed to estimate TRX fee');
        }
        break;
      case 'BTC': {
        const rate = await fetchRecommendedFeeRate();
        fee = calculateFee(200, rate) / 1e8;
        break;
      }
      case 'XMR': {
        const perKB = await fetchFeePerKB();
        fee = perKB / 1e12;
        break;
      }
    }

    res.json({ currency, fee });
  } catch (err) {
    if (!Boom.isBoom(err)) {
      return next(Boom.internal(err.message));
    }
    next(err);
  }
};
