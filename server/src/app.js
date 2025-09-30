const express = require('express')
const db = require('./utils/db')

const middleware = require('./utils/middleware')
const recipesRouter = require('./controllers/recipes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const app = express()

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/recipes', recipesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app