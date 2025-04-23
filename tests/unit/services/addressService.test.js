// tests/unit/services/addressService.test.js
const AddressPool = require('../../../src/models/AddressPool');
const { createDepositAddress } = require('../../../src/services/addressService');

 // Mock the AddressPool model
 jest.mock('../../../src/models/AddressPool', () => ({
  create: jest.fn().mockResolvedValue(undefined)
}));

 // Mock each walletService generateAddress function
 jest.mock('../../../src/services/walletService/btcService', () => ({
  generateAddress: jest.fn().mockResolvedValue('btc-test-address')
}));
jest.mock('../../../src/services/walletService/ethService', () => ({
  generateAddress: jest.fn().mockResolvedValue('eth-test-address')
}));
jest.mock('../../../src/services/walletService/tronService', () => ({
  generateAddress: jest.fn().mockResolvedValue('tron-test-address')
}));
jest.mock('../../../src/services/walletService/moneroService', () => ({
  generateSubaddress: jest.fn().mockResolvedValue('xmr-test-subaddress')
}));

describe('addressService.createDepositAddress', () => {
  const userHash = 'user1';

  beforeEach(() => {
    AddressPool.create.mockClear();
  });

  it('should generate and store a BTC address', async () => {
    const addr = await createDepositAddress(userHash, 'BTC');
    expect(addr).toBe('btc-test-address');
    expect(AddressPool.create).toHaveBeenCalledWith(expect.objectContaining({
      userHash,
      currency: 'BTC',
      address: 'btc-test-address',
      expiresAt: expect.any(Date)
    }));
  });

  it('should generate and store an ETH address', async () => {
    const addr = await createDepositAddress(userHash, 'ETH');
    expect(addr).toBe('eth-test-address');
    expect(AddressPool.create).toHaveBeenCalledWith(expect.objectContaining({
      userHash,
      currency: 'ETH',
      address: 'eth-test-address',
      expiresAt: expect.any(Date)
    }));
  });

  it('should generate and store a TRON address', async () => {
    const addr = await createDepositAddress(userHash, 'TRON');
    expect(addr).toBe('tron-test-address');
    expect(AddressPool.create).toHaveBeenCalledWith(expect.objectContaining({
      userHash,
      currency: 'TRON',
      address: 'tron-test-address',
      expiresAt: expect.any(Date)
    }));
  });

  it('should generate and store an XMR subaddress', async () => {
    const addr = await createDepositAddress(userHash, 'XMR');
    expect(addr).toBe('xmr-test-subaddress');
    expect(AddressPool.create).toHaveBeenCalledWith(expect.objectContaining({
      userHash,
      currency: 'XMR',
      address: 'xmr-test-subaddress',
      expiresAt: expect.any(Date)
    }));
  });

  it('should throw a 400 error for unsupported currency', async () => {
    await expect(createDepositAddress(userHash, 'DOGE'))
      .rejects
      .toMatchObject({ status: 400, message: 'Unsupported currency' });
  });
});
