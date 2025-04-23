const fs = require('fs');
const path = require('path');
const { encrypt } = require('../../../src/utils/encryptUtil');
const { generateWithdrawalProof } = require('../../../src/utils/proofUtil');

jest.mock('fs');
jest.mock('../../../src/utils/encryptUtil', () => ({
  encrypt: jest.fn(text => `ENC[${text}]`)
}));

describe('proofUtil', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockClear();
    fs.writeFileSync.mockClear();
  });

  it('encrypts and writes a proof file and returns its URL path', async () => {
    const userHash = 'u1';
    const txHash  = '0xdeadbeef';
    const url = await generateWithdrawalProof(userHash, txHash);

    // It should have built a proofs directory
    expect(fs.existsSync).toHaveBeenCalledWith(
      path.resolve(__dirname, '../../../src/proofs')
    );
    expect(fs.mkdirSync).toHaveBeenCalled();

    // It should write exactly the encrypted JSON blob
     // grab the actual first argument passed into encrypt()
     const actualPlain = encrypt.mock.calls[0][0];
     const obj = JSON.parse(actualPlain);
     expect(obj).toMatchObject({ userHash, txHash });
      expect(typeof obj.timestamp).toBe('string');
       expect(fs.writeFileSync).toHaveBeenCalledWith(
           expect.stringMatching(/0xdeadbeef\.proof\.enc$/),
           `ENC[${actualPlain}]`
         );
         
    // URL must point at your static mount
    expect(url).toEqual(`/proofs/${txHash}.proof.enc`);
  });
});
