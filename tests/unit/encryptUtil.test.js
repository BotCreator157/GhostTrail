const { encrypt, decrypt } = require('../../src/utils/encryptUtil');

describe('Encrypt Util', () => {
  it('should encrypt and then decrypt text correctly', () => {
    const plaintext = 'hello world';
    const encrypted = encrypt(plaintext);
    expect(typeof encrypted).toBe('string');
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });
});
