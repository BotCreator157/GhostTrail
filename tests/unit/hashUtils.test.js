const { genSalt, hash } = require('../../src/utils/hashUtil');
const crypto = require('crypto');

describe('Hash Util', () => {
  it('should generate a hex salt string of length 32', () => {
    const salt = genSalt();
    expect(typeof salt).toBe('string');
    expect(salt).toMatch(/^[0-9a-f]{32,}$/i);
  });

  it('should produce consistent SHA-256 hash for same inputs', () => {
    const id = 'telegramId';
    const salt = 'randomSalt';
    const h1 = hash(id, salt);
    const h2 = hash(id, salt);
    expect(h1).toBe(h2);
    expect(h1.length).toBe(64);
  });
});