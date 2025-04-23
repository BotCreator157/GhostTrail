developer-guide.md

GhostTrail Developer Guide

Welcome to GhostTrail development! This guide will help you set up, extend, and maintain the project.

Getting Started

Clone and Install

git clone https://github.com/your-ghosttrail-repo.git
cd GhostTrail-Bot
npm install

Environment Setup

Create your .env file:

cp .env.example .env

Fill in your:

MongoDB URI

Alchemy Sepolia RPC URL

Hot wallet private/public key

TRON private key

Bot API key for authentication

Running Locally

npm start

Server will start on localhost:3000.

Project Structure

Folder

Purpose

/src/controllers/

API route handlers (users, deposits, withdrawals, portfolio)

/src/services/

Wallet operations (Ethereum, Tron, Monero)

/src/utils/

Helpers like encryption, fee calculation

/tests/

Jest unit and integration tests

/proofs/

Stores generated encrypted proof files

How to Add a New Crypto

Add new xyzService.js inside /services/walletService/

Extend withdrawalController.js to support the new currency

Update /api/explore to list the new supported token

Testing

Run:

npm test

Or test endpoints manually with Postman.

Postman headers:

Add x-api-key: your_BOT_API_KEY for /api/deposits and /api/withdrawals

Deployment

Deploy to Heroku:

heroku create ghosttrail-bot
heroku config:set BOT_API_KEY=yourapikey
heroku config:set ETH_RPC_URL=youralchemyurl
heroku config:set ETH_PRIVATE_KEY=yourprivatekey
heroku config:set HOT_WALLET_ADDRESS=yourpublicaddress
heroku config:set TRON_PRIVATE_KEY=yourtronprivatekey

git push heroku main

Heroku will autodeploy and run your app.

Coding Standards

Use async/await consistently

Gracefully handle errors

Never expose private keys or secrets

Follow modular design (separate files for controllers, services, utils)

✅ DONE

These three files will make your GhostTrail project look extremely mature and ready for:

Public GitHub launch

Attracting contributors

Attracting early backers

Even interview showcase!