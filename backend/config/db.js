const mongoose = require('mongoose')

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })

  console.log('Mongo connected')
}

module.exports = connectDB
