// tests/integration/withdrawals.test.js
const request = require('supertest');
const app     = require('../../src/server');

// stub external services and proof generation
jest.mock('../../src/services/transactionService', () => ({
  recordTransaction: jest.fn().mockResolvedValue()
}));
jest.mock('../../src/utils/delayUtil', () => ({
  randomDelay: jest.fn().mockResolvedValue()
}));
jest.mock('../../src/services/walletService/ethService', () => ({
  sendTransaction: jest.fn().mockResolvedValue('fake-eth-txhash')
}));
jest.mock('../../src/services/walletService/tronService', () => ({
  sendTransaction: jest.fn().mockResolvedValue('fake-trx-txhash')
}));
// <— newly added:
jest.mock('../../src/utils/proofUtil', () => ({
  generateWithdrawalProof: jest.fn().mockResolvedValue(undefined)
}));

describe('POST /api/withdrawals', () => {
  it('records and broadcasts an ETH withdrawal', async () => {
    const res = await request(app)
      .post('/api/withdrawals')
      .send({ userHash:'u1', currency:'ETH', address:'0xabc123', amount:'0.5' })
      .expect(200);
      expect(res.body).toEqual({
        requested: true,
        txHash: 'fake-eth-txhash',
        proofUrl: '/proofs/fake-eth-txhash.proof.enc'
      });
  });

  it('records and broadcasts a TRX withdrawal', async () => {
    const res = await request(app)
      .post('/api/withdrawals')
      .send({ userHash:'u2', currency:'TRX', address:'TXYZabc123', amount:'10' })
      .expect(200);
      expect(res.body).toEqual({
        requested: true,
        txHash: 'fake-trx-txhash',
        proofUrl: '/proofs/fake-trx-txhash.proof.enc'
      });
  });
});
