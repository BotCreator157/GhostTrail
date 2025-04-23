// src/bot/utils/apiClient.js
const axios = require('axios');

const base = process.env.BACKEND_API_URL
  || `${(process.env.APP_URL||'').replace(/\/+$/,'')}/api`;

const apiClient = axios.create({
  baseURL:  base,
  timeout: 10000,
});

module.exports = { apiClient };
