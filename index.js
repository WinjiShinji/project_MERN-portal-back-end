require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./src/config/corsOptions')
const mongoose = require('mongoose')
const connectDB = require('./src/config/connectDB')
const path = require('path')
const cookieParser = require('cookie-parser')
const authorizedJWT = require('./src/middleware/authorizedJWT')

// PORT //
const PORT = process.env.PORT || 3500

// DB Connect //
connectDB()

// Event Logging //
// @TODO: event logging handle

// JSON //
app.use(express.json())

// CORS //
app.use(cors(corsOptions))
app.options('*', cors()) // enable pre-flight requests

// Cookies Parser //
app.use(cookieParser())

// Static Files //
app.use(express.static('public'))

// Routes //
app.use('/', require('./src/routes/root'))
app.use('/register', require('./src/routes/register'))
app.use('/login', require('./src/routes/login'))
app.use('/logout', require('./src/routes/logout'))
app.use('/refresh', require('./src/routes/refresh'))

// Protected Routes //
app.use(authorizedJWT)
app.use('/', require('./src/routes/protected'))

// Database Connection Check //
mongoose.connection.once('open', () => {
  console.log('Connected To Database')
})

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})

// Vercel //
module.exports = app