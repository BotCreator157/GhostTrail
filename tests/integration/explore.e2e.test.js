// tests/integration/explore.e2e.test.js
const request = require('supertest');
const app     = require('../../src/server');

describe('GET /api/explore', () => {
  it('returns the supported chain list', async () => {
    const res = await request(app)
      .get('/api/explore')
      .expect(200);
    expect(res.body).toEqual({
      chains: ['BTC','ETH','TRX','XMR']
    });
  });
});
