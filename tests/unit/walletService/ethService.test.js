// tests/unit/walletService/ethService.test.js


// 1) Mock the ethers package itself, pulling in real BigNumber
//    from @ethersproject/bignumber so our utils still work.
jest.mock('ethers', () => {
  const { BigNumber } = require('@ethersproject/bignumber');

  // Create a fake Wallet constructor...
  const FakeWallet = jest.fn().mockImplementation(() => ({
    sendTransaction: jest.fn().mockResolvedValue({
      wait: jest.fn().mockResolvedValue(undefined),
      hash: '0xfakehash'
    })
  }));
  // ...and stub out the static createRandom() it uses for generateAddress()
  FakeWallet.createRandom = jest.fn().mockReturnValue({
    address: '0x' + 'a'.repeat(40)
  });

  return {
    BigNumber,
    utils: { parseEther: jest.fn(() => BigNumber.from('0')) },
    providers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({}))
    },
    Wallet: FakeWallet
  };
});

// 2) Mock your fee util so sendTransaction gets a predictable gasPrice
jest.mock('../../../src/utils/ethFeeUtil', () => {
  const { BigNumber } = require('@ethersproject/bignumber');
  return {
    fetchBaseGasPrice: jest.fn().mockResolvedValue(BigNumber.from('1000')),
    randomizeGasPrice: jest.fn().mockReturnValue(BigNumber.from('1100'))
  };
});

const { generateAddress, sendTransaction } = require('../../../src/services/walletService/ethService');

describe('ethService', () => {
  it('generateAddress() returns a 0x… address', async () => {
    const addr = await generateAddress('anyUserHash');
    expect(addr).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it('sendTransaction() fetches & randomizes gas, sends, waits, and returns hash', async () => {
    const hash = await sendTransaction('0xfrom', '0xto', '0.5');
    expect(hash).toBe('0xfakehash');
  });
});