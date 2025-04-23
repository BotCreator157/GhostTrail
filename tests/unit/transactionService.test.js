jest.mock('../../src/models/Transaction', () => ({
    create: jest.fn((tx) => Promise.resolve({ ...tx, id: 'fakeTxId' }))
  }));
  
  const Transaction = require('../../src/models/Transaction');
  const { recordTransaction } = require('../../src/services/transactionService');
  
  describe('Transaction Service', () => {
    it('should encrypt metadata and create a transaction record', async () => {
      const userHash = 'u1';
      const currency = 'BTC';
      const type = 'deposit';
      const address = 'addr';
      const amount = '1';
      const metadataObj = { foo: 'bar' };
  
      const result = await recordTransaction(userHash, currency, type, address, amount, metadataObj);
      expect(Transaction.create).toHaveBeenCalledWith(expect.objectContaining({
        userHash,
        currency,
        type,
        address,
        amount,
        metadata: expect.any(String)
      }));
      expect(result.id).toBe('fakeTxId');
    });
  });