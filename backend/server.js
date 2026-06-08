require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const connectDB = require('./config/db')
const logger = require('./utils/logger')
const { generalLimiter } = require('./middlewares/rateLimiter')
const { errorHandler, notFound } = require('./middlewares/errorHandler')

const resumeRoutes = require('./routes/resumeRoutes')
const healthRoutes = require('./routes/healthRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

// CORS
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000'
).split(',')
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`))
      }
    },
    credentials: true,
  }),
)

// Request parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  }),
)

// Rate limiting
app.use('/api', generalLimiter)

// Routes
app.use('/api/resume', resumeRoutes)
app.use('/health', healthRoutes)

// Root
app.get('/', (_req, res) => {
  res.json({
    name: 'Resume Analyzer API',
    version: '1.0.0',
    status: 'running',
    docs: '/health',
  })
})

// 404 handler
app.use(notFound)

// Global error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Resume Analyzer API running on port ${PORT}`)
  logger.info(`📋 Environment: ${process.env.NODE_ENV || 'development'}`)
})

module.exports = app
