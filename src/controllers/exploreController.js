const express = require('express');
const router  = express.Router();

const SUPPORTED_CHAINS = ['BTC','ETH','TRX','XMR'];
router.get('/', (req, res) => {
  res.json({ chains: SUPPORTED_CHAINS });
});

module.exports = router;
