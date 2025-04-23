const express     = require('express');
const Joi         = require('joi');
const validate    = require('../middleware/validation');
const Transaction = require('../models/Transaction');

const router = express.Router();

// GET /api/portfolio/:userHash
const portfolioSchema = Joi.object({ userHash: Joi.string().required() });
router.get(
  '/:userHash',
  validate(portfolioSchema, 'params'),
  async (req, res, next) => {
    try {
      let txs = await Transaction.find({ userHash: req.params.userHash });
      // sort descending by createdAt
      txs = txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json({
        transactions: txs.map(t => ({
          type:      t.type,
          currency:  t.currency,
          address:   t.address,
          amount:    t.amount,
          txHash:    t.txHash,
          createdAt: t.createdAt
        }))
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
