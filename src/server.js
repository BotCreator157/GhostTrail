// src/server.js
require('dotenv').config()
const express    = require('express')
const mongoose   = require('mongoose')
const path       = require('path')
const helmet     = require('helmet')
const rateLimit  = require('express-rate-limit')
const hpp        = require('hpp')
const cors       = require('cors')
const sanitize   = require('mongo-sanitize')   // your manual sanitizer
const { getBalance } = require('./controllers/balancesController');
const { getFee     } = require('./controllers/feesController');


// your route handlers
const userRoutes       = require('./controllers/userController')
const depositRoutes    = require('./controllers/depositController')
const { router: withdrawalRouter } = require('./controllers/withdrawalController')
const addressRoutes    = require('./controllers/addressPoolController')
const portfolioRoutes  = require('./controllers/portfolioController')
const exploreRoutes    = require('./controllers/exploreController')

const app = express()

// trust the first proxy (Heroku), so rate-limit will read X-Forwarded-For safely
app.set('trust proxy', 1)

// 1) hide fingerprint
app.disable('x-powered-by')

// 2) secure headers
app.use(helmet())

// 3) CORS for localhost (dev)
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }))

// 4) rate‑limit all /api
const apiLimiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', apiLimiter)

// 5) body parser + size limit
app.use(express.json({ limit: '10kb' }))

// 6) manual sanitize only body & params
app.use((req, res, next) => {
  if (req.body)   req.body   = sanitize(req.body)
  if (req.params) req.params = sanitize(req.params)
  next()
})

// 7) HTTP‑param‑pollution protection
app.use(hpp())

// ── your API mounts ───────────────────────────────────────────────
app.use('/api/users',      userRoutes)
app.use('/api/deposits',   depositRoutes)
app.use('/api/withdrawals', withdrawalRouter)
app.use('/api/addresses',  addressRoutes)
app.use('/api/portfolio',  portfolioRoutes)
app.use('/api/explore',    exploreRoutes)
app.use('/proofs',         express.static(path.join(__dirname, 'proofs')))

app.get('/api/balances/:address', getBalance);
app.get('/api/fees/:currency',    getFee);


// global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

// connect & listen
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected')
      app.listen(process.env.PORT || 3000, () =>
        console.log(`Server running on port ${process.env.PORT||3000}`))
    })
    .catch(e => {
      console.error('Init error', e)
      process.exit(1)
    })
}

module.exports = app
