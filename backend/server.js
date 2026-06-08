require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const dbModule = require('./config/db')

console.log('DB MODULE:', dbModule)

const connectDB = dbModule.default || dbModule.connectDB || dbModule

console.log('TYPE:', typeof connectDB)

const logger = require('./utils/logger')

const { generalLimiter } = require('./middlewares/rateLimiter')

const { errorHandler, notFound } = require('./middlewares/errorHandler')

const resumeRoutes = require('./routes/resumeRoutes')

const healthRoutes = require('./routes/healthRoutes')

const app = express()

// ONLY THIS
console.log('Before DB')

if (typeof connectDB === 'function') {
  connectDB()
    .then(() => {
      console.log('DB connected')
    })
    .catch((err) => {
      console.error('DB ERROR:', err)
    })
}

console.log('After DB')

app.use(helmet())

app.use(cors())

app.use(express.json())

app.use(
  morgan('combined', {
    stream: {
      write: console.log,
    },
  }),
)

app.use('/api', generalLimiter)

app.use('/api/resume', resumeRoutes)

app.use('/health', healthRoutes)

app.use(notFound)

app.use(errorHandler)

module.exports = app
