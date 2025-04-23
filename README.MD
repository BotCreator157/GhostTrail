README.md

GhostTrail - Anonymous Payment Facilitator

GhostTrail is a privacy-first escrow crypto payment bot supporting USDT, ETH, and TRX built with Node.js, MongoDB, and Telegram integration. It is designed for censorship resistance, anonymity, and decentralized financial empowerment.

Architecture

See Architecture.md

Installation

# Clone the repository
git clone https://github.com/your-ghosttrail-repo.git
cd GhostTrail-Bot

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in your API keys, RPC URLs, and wallet details

# Start the server
npm start

API Endpoints

Endpoint

Method

Purpose

/api/users

POST

Create a new user hash

/api/deposits

POST

Request a deposit address

/api/portfolio/:userHash

GET

View user transaction portfolio

/api/explore

GET

View supported currencies

/api/withdrawals

POST

Send crypto anonymously

/proofs/:filename

GET

Download transaction proof file

Testing

Unit tests: npm test

API tests: Postman collection available

License

Coming soon.