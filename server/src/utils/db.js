const mongoose = require('mongoose')
const config = require('../utils/config')

let isDBConnected = false

const connectDB = async (attempt = 1, maxDelay = 60000) => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
    })
    isDBConnected = true
    console.log('connected to mongo db')
  } catch (error) {
    isDBConnected = false
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), maxDelay)
    console.error(`DB connection failed (attempt ${attempt}): ${error.message}. Retrying in ${delay}ms...`)
    setTimeout(() => connectDB(attempt + 1, maxDelay), delay)
  }
}

connectDB()

module.exports = { isDBConnected }
