const { estimateFee } = require('../../../src/utils/tronFeeUtil');

describe('tronFeeUtil', () => {
  it('returns 0 (placeholder) for any tronWeb instance', async () => {
    const fakeTronWeb = { foo: 'bar' };
    const fee = await estimateFee(fakeTronWeb);
    expect(fee).toBe(0);
  });
});
