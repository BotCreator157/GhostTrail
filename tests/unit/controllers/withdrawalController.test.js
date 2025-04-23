const { selectRandomWithdrawalAddress } = require('../../../src/controllers/withdrawalController');

describe('selectRandomWithdrawalAddress', () => {
  it('always returns one of the entries in the array', () => {
    const candidates = ['A', 'B', 'C', 'D'];
    // run it multiple times to catch randomness
    for (let i = 0; i < 20; i++) {
      const picked = selectRandomWithdrawalAddress(candidates);
      expect(candidates).toContain(picked);
    }
  });
});