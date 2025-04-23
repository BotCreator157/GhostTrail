architecture.md

GhostTrail System Architecture

System Overview

GhostTrail consists of:

Frontend: Telegram bot (using Telegraf.js)

Backend: Node.js (Express.js REST API)

Database: MongoDB Atlas

Deployment: Heroku cloud platform

Crypto Networks:

Ethereum Sepolia Testnet (Alchemy)

Tron Shasta Testnet (TronWallet SDK)

Backend Stack

Node.js (v18+)

Express.js

MongoDB Atlas

Heroku

Crypto Integration Stack

Ethereum (Sepolia via Alchemy RPC)

Tron (Shasta via TronWallet)

Security Measures

Helmet.js for security headers

CORS protection

API Key authentication for deposits and withdrawals

Rate limiting (max 60 requests/minute per IP)

Future: MongoDB Sanitize, XSS Clean, HPP (planned after Express upgrade)

Database Schemas

User Collection

telegramId: String

userHash: String (Unique)

createdAt: Timestamp

AddressPool Collection

userHash: String

currency: String

address: String

Transaction Collection

userHash: String

type: String (deposit/withdrawal)

currency: String

amount: String

txHash: String

createdAt: Timestamp

Transaction Lifecycle

User connects through Telegram bot.

UserHash generated via POST /api/users.

Deposit address issued via POST /api/deposits.

Deposits monitored (future enhancement).

User initiates withdrawal via POST /api/withdrawals.

Withdrawal is delayed and broadcasted after randomization.

Proof file generated and stored.

User can download proof from /proofs/:filename.

Proof Generation

Withdrawals generate an encrypted .proof.enc file to provide verifiable audit trails without exposing user identities.

Proof files are served securely via static /proofs/ route.

