const qr = require('qr-image');
function generateQr(address){
  return qr.imageSync(address,{ type:'png' });
}
module.exports = { generateQr };