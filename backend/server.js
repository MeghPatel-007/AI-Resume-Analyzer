require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const connectDB = require('./config/db')

const logger = require('./utils/logger')

const { generalLimiter } = require('./middlewares/rateLimiter')

const { errorHandler, notFound } = require('./middlewares/errorHandler')

const resumeRoutes = require('./routes/resumeRoutes')

const healthRoutes = require('./routes/healthRoutes')

const app = express()

// Connect DB
console.log('Before DB')

connectDB()
  .then(() => {
    console.log('DB connected')
  })
  .catch((err) => {
    console.error('DB ERROR:', err.message)
  })

console.log('After DB')

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  }),
)

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((x) => x.trim())

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      callback(new Error('Origin not allowed'))
    },

    credentials: true,
  }),
)

// Body parsing
app.use(
  express.json({
    limit: '10mb',
  }),
)

app.use(
  express.urlencoded({
    extended: true,

    limit: '10mb',
  }),
)

// Logs
app.use(
  morgan('combined', {
    stream: {
      write(msg) {
        logger.http(msg.trim())
      },
    },
  }),
)

// Rate limit
app.use('/api', generalLimiter)

// Routes
app.use('/api/resume', resumeRoutes)

app.use('/health', healthRoutes)

app.get('/', (req, res) => {
  res.json({
    status: 'running',
  })
})

// Error handlers
app.use(notFound)

app.use(errorHandler)

// IMPORTANT
module.exports = app
