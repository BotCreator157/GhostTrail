const request = require('supertest');
const fs      = require('fs');
const path    = require('path');
const app     = require('../../src/server');

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

describe('E2E /api/withdrawals', () => {
  it('should 400 if params are missing', async () => {
    await request(app)
      .post('/api/withdrawals')
      .send({ currency: 'ETH' })  // missing userHash, address, amount
      .expect(400);
  });

  it('should 500 on unsupported currency', async () => {
    await request(app)
      .post('/api/withdrawals')
      .send({ userHash: 'u1', currency: 'BTC', address: 'addr', amount: '1' })
      .expect(500);
  });

  it('should process ETH withdrawal and serve proof URL', async () => {
    const res = await request(app)
      .post('/api/withdrawals')
      .send({ userHash:'u1', currency:'ETH', address:'0xabc', amount:'0.5' })
      .expect(200);

    expect(res.body).toEqual({
      requested: true,
      txHash: 'fake-eth-txhash',
      proofUrl: '/proofs/fake-eth-txhash.proof.enc'
    });

    // static file should exist (or at least 200)
    await request(app)
      .get(res.body.proofUrl)
      .expect(200);
  });

  it('should process TRX withdrawal and serve proof URL', async () => {
    const res = await request(app)
      .post('/api/withdrawals')
      .send({ userHash:'u2', currency:'TRX', address:'TXYZ', amount:'10' })
      .expect(200);

    expect(res.body).toEqual({
      requested: true,
      txHash: 'fake-trx-txhash',
      proofUrl: '/proofs/fake-trx-txhash.proof.enc'
    });

    await request(app)
      .get(res.body.proofUrl)
      .expect(200);
  });
});
