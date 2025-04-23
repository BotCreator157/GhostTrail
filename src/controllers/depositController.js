const express = require('express');
const Joi     = require('joi');
const validate= require('../middleware/validation');
const { createDepositAddress } = require('../services/addressService');
const { recordTransaction }     = require('../services/transactionService');
const catchAsync  = require('../utils/catchAsync');

const router = express.Router();
const depositSchema = Joi.object({ userHash:Joi.string().required(), currency:Joi.string().valid('BTC','ETH','TRX','XMR').required(), amount:Joi.string().pattern(/^\d+(\.\d+)?$/).required() });
router.post(
  '/',
  validate(depositSchema,'body'),
  catchAsync(async(req,res)=>{
    const { userHash,currency,amount } = req.body;
    const address = await createDepositAddress(userHash,currency);
    await recordTransaction(userHash,currency,'deposit',address,amount,{});
    res.json({ address });
  })
);
module.exports = router;
