const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI).then(
  () => {
    console.log('connected to mongo db')
  }
).catch(
  error => {
    console.log('error connecting to MongoDB:', error.message)
  }
)
