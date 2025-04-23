const axios = require('axios');
const { fetchRecommendedFeeRate, calculateFee } = require('../../../src/utils/btcFeeUtil');

jest.mock('axios');

describe('btcFeeUtil', () => {
  describe('fetchRecommendedFeeRate()', () => {
    it('fetches and returns the fastestFee from the mempool API', async () => {
      axios.get.mockResolvedValue({ data: { fastestFee: 42 } });
      const feeRate = await fetchRecommendedFeeRate();
      expect(axios.get).toHaveBeenCalledWith('https://mempool.space/api/v1/fees/recommended');
      expect(feeRate).toBe(42);
    });
  });

  describe('calculateFee()', () => {
    it('multiplies vbytes × satsPerVByte and rounds up', () => {
      expect(calculateFee(200, 10)).toBe(2000);
      expect(calculateFee(150, 0.5)).toBe(Math.ceil(150 * 0.5));
    });
  });
});
