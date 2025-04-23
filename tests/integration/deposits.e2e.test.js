const request = require('supertest');
const app     = require('../../src/server');

// stub out addressService and transactionService
jest.mock('../../src/services/addressService', () => ({
  createDepositAddress: jest.fn().mockResolvedValue('fake-dep-address')
}));
jest.mock('../../src/services/transactionService', () => ({
  recordTransaction: jest.fn().mockResolvedValue()
}));

describe('E2E /api/deposits', () => {
  it('should 400 if required params are missing', async () => {
    await request(app)
      .post('/api/deposits')
      .send({})
      .expect(400);
  });

  it('should record a deposit and return a new address', async () => {
    const res = await request(app)
      .post('/api/deposits')
      .send({
        userHash: 'u123',
        currency: 'ETH',
        amount:   '1.0'
      })
      .expect(200);

    expect(res.body).toEqual({
      address: 'fake-dep-address'
    });
  });
});
