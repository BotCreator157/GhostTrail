// src/utils/proofUtil.js
const fs = require('fs');
const path = require('path');
const { encrypt } = require('./encryptUtil');

/**
 * Generate a minimal JSON proof, encrypt it, write to disk,
 * and return a URL path for serving.
 */
async function generateWithdrawalProof(userHash, txHash) {
  const proofsDir = path.resolve(__dirname, '../proofs');
  if (!fs.existsSync(proofsDir)) {
    fs.mkdirSync(proofsDir);
  }

  const timestamp = new Date().toISOString();
  const plain = JSON.stringify({ userHash, txHash, timestamp });
  const encrypted = encrypt(plain);

  const filename = `${txHash}.proof.enc`;
  const filepath = path.join(proofsDir, filename);
  fs.writeFileSync(filepath, encrypted);

  return `/proofs/${filename}`;
}

module.exports = { generateWithdrawalProof };