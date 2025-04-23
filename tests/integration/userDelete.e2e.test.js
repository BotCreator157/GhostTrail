// tests/integration/usersDelete.e2e.test.js

 // --- MOCK MONGOOSE MODELS TO AVOID REAL DB CALLS -------------
 jest.mock('../../src/models/User', () => ({
   deleteOne: jest.fn().mockResolvedValue({ acknowledged: true })
 }));
 jest.mock('../../src/models/Transaction', () => ({
   deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
 }));
 jest.mock('../../src/models/AddressPool', () => ({
   deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
 }));
 // --------------------------------------------------------------


const request = require('supertest');
const app     = require('../../src/server');

describe('E2E DELETE /api/users/:userHash', () => {
  const fakeHash = 'testhash123';

  it('should delete user data and return { deleted: true }', async () => {
    const res = await request(app)
      .delete(`/api/users/${fakeHash}`)
      .expect(200);

    expect(res.body).toEqual({ deleted: true });
  });
});
