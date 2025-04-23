const moneroRpc = require('../../../src/integrations/moneroRpcClient');
const { fetchFeePerKB } = require('../../../src/utils/moneroFeeUtil');

jest.mock('../../../src/integrations/moneroRpcClient');

describe('moneroFeeUtil', () => {
  it('posts get_fee_estimate and returns fee from result', async () => {
    moneroRpc.post.mockResolvedValue({ data: { result: { fee: 123456 } } });
    const fee = await fetchFeePerKB();
    expect(moneroRpc.post).toHaveBeenCalledWith('/', {
      jsonrpc: '2.0',
      id: '0',
      method: 'get_fee_estimate',
      params: []
    });
    expect(fee).toBe(123456);
  });
});
