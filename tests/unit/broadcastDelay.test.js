// test/broadcastDelayTest.js
// ----------------------------------------
// tests/unit/broadcastDelay.test.js
// ----------------------------------------

// ✅ Always mock external services FIRST before loading the controller
// tests/unit/broadcastDelay.test.js

// ─── 1) MOCK EVERYTHING BEFORE requiring the controller ────────────────────
// Mock the delay util so our tests run instantly
jest.mock('../../src/utils/delayUtil', () => ({
  randomDelay: jest.fn().mockResolvedValue(undefined)
}));

// Mock the ETH & TRX services' sendTransaction methods
jest.mock('../../src/services/walletService/ethService', () => ({
  sendTransaction: jest.fn().mockResolvedValue('fake-eth-txhash')
}));
jest.mock('../../src/services/walletService/tronService', () => ({
  sendTransaction: jest.fn().mockResolvedValue('fake-trx-txhash')
}));

// You can also mock recordTransaction if you need it, e.g.:
// jest.mock('../../src/services/transactionService', () => ({
//   recordTransaction: jest.fn().mockResolvedValue()
// }));

// ─── 2) REQUIRE the module under test ─────────────────────────────────────
const { broadcastDelayedWithdrawal } = require('../../src/controllers/withdrawalController');

// ─── 3) WRITE YOUR TESTS ─────────────────────────────────────────────────
describe('broadcastDelayedWithdrawal', () => {
  it('should delay and then return ETH txHash when currency is ETH', async () => {
    const txData = {
      currency: 'ETH',
      from: '0xFrom',
      to:   '0xTo',
      amount: '0.5'
    };

    const result = await broadcastDelayedWithdrawal(txData);
    expect(result).toBe('fake-eth-txhash');
  });

  it('should delay and then return TRX txHash when currency is TRX', async () => {
    const txData = {
      currency: 'TRX',
      from: 'TFrom',
      to:   'TTo',
      amount: '100'
    };

    const result = await broadcastDelayedWithdrawal(txData);
    expect(result).toBe('fake-trx-txhash');
  });

  it('should throw an error for any unsupported currency', async () => {
    const txData = {
      currency: 'BTC',  // not ETH or TRX
      from: 'BFrom',
      to:   'BTo',
      amount: '1'
    };

    await expect(broadcastDelayedWithdrawal(txData))
      .rejects
      .toThrow('Unsupported currency');
  });
});