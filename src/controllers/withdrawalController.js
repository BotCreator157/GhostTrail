const express = require('express');
const Joi     = require('joi');
const validate = require('../middleware/validation');
const { recordTransaction }            = require('../services/transactionService');
const { randomDelay }                  = require('../utils/delayUtil');
const ethService                       = require('../services/walletService/ethService');
const tronService                      = require('../services/walletService/tronService');
const { selectRandomWithdrawalAddress }= require('../utils/addressUtil');
const { generateWithdrawalProof }      = require('../utils/proofUtil');
const { obfuscateFeeDisplay }          = require('../utils/feeUtil');

const router = express.Router();

// --- Validation schema for POST /api/withdrawals
const withdrawalSchema = Joi.object({
  userHash: Joi.string().required(),
  currency: Joi.string().valid('BTC','ETH','TRX','XMR').required(),
  address:  Joi.alternatives()
                .try(Joi.string(), Joi.array().items(Joi.string()))
                .required(),
  amount:   Joi.string().pattern(/^\d+(\.\d+)?$/).required()
});

router.post(
  '/',
  validate(withdrawalSchema, 'body'),
  async (req, res, next) => {
    try {
      const { userHash, currency, address, amount } = req.body;
      const destination = Array.isArray(address)
        ? selectRandomWithdrawalAddress(address)
        : address;

      await recordTransaction(userHash, currency, 'withdrawal', destination, amount, {});

      const txData = { currency, from: process.env.HOT_WALLET_ADDRESS, to: destination, amount };
      const txResult = await broadcastDelayedWithdrawal(txData);
      const txHash = txResult.hash ?? txResult;
      const fee    = txResult.fee;

      let proofUrl = await generateWithdrawalProof(userHash, txHash);
      if (!proofUrl) proofUrl = `/proofs/${txHash}.proof.enc`;

      const response = { requested: true, txHash };
      if (currency === 'ETH' && fee != null) {
        response.fee = obfuscateFeeDisplay(fee);
      }
      response.proofUrl = proofUrl;

      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

async function broadcastDelayedWithdrawal(txData) {
  console.log(`[GhostTrail] Delaying withdrawal broadcast for ${txData.currency}...`);
  await randomDelay(3, 5);
  console.log(`[GhostTrail] Delay finished. Broadcasting withdrawal.`);
  let result;
  if (txData.currency === 'ETH') {
    result = await ethService.sendTransaction(txData.from, txData.to, txData.amount);
  } else if (txData.currency === 'TRX') {
    result = await tronService.sendTransaction(txData.from, txData.to, txData.amount);
  } else {
    console.error(`[GhostTrail] Unsupported currency: ${txData.currency}`);
    throw new Error('Unsupported currency');
  }
  console.log(`[GhostTrail] Withdrawal broadcasted. TX Hash: ${typeof result === 'string' ? result : result.hash}`);
  return result;
}

module.exports = { router, broadcastDelayedWithdrawal, selectRandomWithdrawalAddress };
