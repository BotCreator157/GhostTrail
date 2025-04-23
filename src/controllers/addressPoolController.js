const express = require('express');
const Joi     = require('joi');
const validate = require('../middleware/validation');
const AddressPool = require('../models/AddressPool');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// GET /api/addresses/:userHash
const listSchema = Joi.object({ userHash: Joi.string().required() });
router.get(
  '/:userHash',
  validate(listSchema, 'params'),
  catchAsync(async (req, res) => {
    const addrs = await AddressPool.find({ userHash: req.params.userHash });
    res.json({
      addresses: addrs.map(a => ({
        currency:  a.currency,
        address:   a.address,
        expiresAt: a.expiresAt
      }))
    });
  })
);

// DELETE /api/addresses/:address
const delSchema = Joi.object({ address: Joi.string().required() });
router.delete(
  '/:address',
  validate(delSchema, 'params'),
  catchAsync(async (req, res) => {
    await AddressPool.deleteOne({ address: req.params.address });
    res.json({ deleted: true });
  })
);

module.exports = router;