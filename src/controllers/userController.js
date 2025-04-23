const express = require('express');
const Joi     = require('joi');
const validate = require('../middleware/validation');
const User    = require('../models/User');
const { hash, genSalt } = require('../utils/hashUtil');

const router = express.Router();

// POST /api/users
const createUserSchema = Joi.object({ telegramId: Joi.string().required() });
router.post(
  '/',
  validate(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { telegramId } = req.body;
      const salt     = genSalt();
      const userHash = hash(telegramId, salt);
      let user = await User.findOne({ telegramId, hash: userHash });
      if (!user) {
        user = await User.create({ telegramId, hash: userHash, salt });
      }
      res.json({ userHash });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/users/:telegramId
const getHashesSchema = Joi.object({ telegramId: Joi.string().required() });
router.get(
  '/:telegramId',
  validate(getHashesSchema, 'params'),
  async (req, res, next) => {
    try {
      const users = await User.find({ telegramId: req.params.telegramId })
                              .select('hash -_id');
      res.json({ userHashes: users.map(u => u.hash) });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/users/:userHash
const deleteUserSchema = Joi.object({ userHash: Joi.string().required() });
router.delete(
  '/:userHash',
  validate(deleteUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { userHash } = req.params;
      await User.deleteOne({ hash: userHash });
      const Transaction = require('../models/Transaction');
      const AddressPool = require('../models/AddressPool');
      await Transaction.deleteMany({ userHash });
      await AddressPool.deleteMany({ userHash });
      res.json({ deleted: true });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
