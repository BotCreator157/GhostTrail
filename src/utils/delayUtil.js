// src/utils/delayUtil.js

function randomDelay(minSeconds = 60, maxSeconds = 600) {
    const minMs = minSeconds * 1000;
    const maxMs = maxSeconds * 1000;
    const delayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  module.exports = {
    randomDelay,
  };