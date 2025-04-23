const { generateAddress } = require('../../../src/services/walletService/btcService');

describe('BTC Service', () => {
  it('should generate a valid Bitcoin Signet address', async () => {
    const address = await generateAddress('dummyHash');
    // Signet addresses can start with 'm','n' or '1'
    expect(typeof address).toBe('string');
    expect(address.length).toBeGreaterThan(25);
    expect(address.match(/^[mn1]/)).not.toBeNull();
  });
});
