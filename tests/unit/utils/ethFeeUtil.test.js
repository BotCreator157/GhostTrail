// tests/unit/utils/ethFeeUtil.test.js
const { fetchBaseGasPrice, randomizeGasPrice } = require('../../../src/utils/ethFeeUtil');
// ethers v6 no longer re‑export BigNumber reliably at the root,
// so we pull it from the dedicated package:
const { BigNumber } = require('@ethersproject/bignumber');

describe('ethFeeUtil', () => {
  describe('fetchBaseGasPrice()', () => {
    it('calls provider.getGasPrice() and returns its BigNumber', async () => {
      const fake = BigNumber.from('1000');
      const provider = { getGasPrice: jest.fn().mockResolvedValue(fake) };
      const result = await fetchBaseGasPrice(provider);
      expect(provider.getGasPrice).toHaveBeenCalled();
      expect(result).toBe(fake);
    });
  });

  describe('randomizeGasPrice()', () => {
    it('returns a BigNumber between +10% and +15% of the base price', () => {
      const base = BigNumber.from('1000');
      const out = randomizeGasPrice(base);
      const min = base.mul(110).div(100);
      const max = base.mul(115).div(100);
      expect(out.gte(min)).toBe(true);
      expect(out.lte(max)).toBe(true);
    });
  });
});