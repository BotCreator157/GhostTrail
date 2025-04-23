// tests/integration/portfolio.e2e.test.js
jest.mock('../../src/models/Transaction', () => ({
    find: jest.fn().mockResolvedValue([
      { userHash:'h1', type:'deposit', currency:'ETH', address:'0xabc', amount:'1', createdAt: new Date() }
    ])
  }));
  
  const request = require('supertest');
  const app     = require('../../src/server');
  
  describe('GET /api/portfolio/:userHash', () => {
    it('lists transactions for that hash', async () => {
      const res = await request(app)
        .get('/api/portfolio/h1')
        .expect(200);
      expect(res.body.transactions).toHaveLength(1);
      expect(res.body.transactions[0]).toMatchObject({
        type: 'deposit',
        currency: 'ETH',
        address: '0xabc',
        amount: '1'
      });
    });
  });
  