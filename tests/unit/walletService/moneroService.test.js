jest.mock('../../../src/integrations/moneroRpcClient', () => ({
  post: jest.fn().mockResolvedValue({
    data: { result: { address: 'fake-monero-subaddress' } }
  })
}));

const moneroService = require('../../../src/services/walletService/moneroService');

describe('Monero Service', () => {
  it('should generate a valid Monero Stagenet subaddress', async () => {
    const address = await moneroService.generateSubaddress('testuser');
    expect(address).toBe('fake-monero-subaddress');
  });
});
