require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const connectDB = require('./config/connectDB')
const path = require('path')
const cookieParser = require('cookie-parser')
const authorizedJWT = require('./middleware/authorizedJWT')


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

// Cookies Parser //
app.use(cookieParser())

// Static Files //
app.use(express.static('public'))

// Routes //
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/logout', require('./routes/logout'))
app.use('/refresh', require('./routes/refresh'))


// Protected Routes //
app.use(authorizedJWT)
app.use('/', require('./routes/protected'))

// Error - 404 //
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404Error.html'))
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found"})
  } else {
    res.type('txt').send("404 Not Found")
  }
})

// Database Connection Check //
mongoose.connection.once('open', () => {
  console.log('Connected To Database')
})

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})