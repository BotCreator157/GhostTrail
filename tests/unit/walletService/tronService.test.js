jest.mock('tronweb', () => {
  return jest.fn().mockImplementation(() => ({
    wallet: {
      createAccount: jest.fn().mockResolvedValue({
        address: { base58: 'fake-tron-address' }
      })
    }
  }));
});

const tronService = require('../../../src/services/walletService/tronService');

describe('Tron Service', () => {
  it('should generate a valid Tron Shasta address', async () => {
    const address = await tronService.generateAddress('testuser');
    expect(address).toBe('fake-tron-address');
  });
});