const { BigNumber }            = require('ethers');
const { parseEther }           = require('ethers').utils;
const { obfuscateFeeDisplay } = require('../../../src/utils/feeUtil');

describe('feeUtil.obfuscateFeeDisplay', () => {
  it('rounds to nearest 0.01 ETH and adds ±1% noise', () => {
    // take exactly 0.1234 ETH in wei
    const realWei = parseEther('0.1234');
    const out = obfuscateFeeDisplay(realWei);

    // must end in " ETH"
    expect(out).toMatch(/ETH$/);

    // parse back the number portion
    const num = parseFloat(out.replace(/ ETH$/, ''));
    // should be roughly near 0.12 ±1%
    expect(num).toBeGreaterThanOrEqual(0.12 * 0.99);
    expect(num).toBeLessThanOrEqual(0.12 * 1.01 + 0.001 /* tiny slack */);
  });
});
