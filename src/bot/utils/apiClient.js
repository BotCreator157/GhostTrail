// src/bot/utils/apiClient.js
const axios = require('axios')
require('dotenv').config()

const apiClient = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  timeout: 10000, // 10 seconds timeout
})

module.exports = { apiClient }