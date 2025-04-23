const request = require('supertest');
const app     = require('../../src/server');

// stub out the User model and hash utilities
jest.mock('../../src/models/User', () => ({
  findOne: jest.fn().mockResolvedValue(null),
  create:  jest.fn().mockResolvedValue({ hash: 'hashed-telegram', salt: 'salty' })
}));
jest.mock('../../src/utils/hashUtil', () => ({
  genSalt: jest.fn().mockReturnValue('salty'),
  hash:    jest.fn().mockReturnValue('hashed-telegram')
}));

describe('E2E /api/users', () => {
  it('should 400 if telegramId is missing', async () => {
    await request(app)
      .post('/api/users')
      .send({})
      .expect(400);
  });

  it('should create (or return) a user on valid request', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ telegramId: 'tg123' })
      .expect(200);

    expect(res.body).toEqual({
      userHash: 'hashed-telegram'
    });
  });
});
