const mongoose = require('mongoose')
const logger = require('../utils/logger')

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })

    logger.info('MongoDB connected')
  } catch (err) {
    logger.error(err.message)

    throw err
  }
}

module.exports = connectDB
