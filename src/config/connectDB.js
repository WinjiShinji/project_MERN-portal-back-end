const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      // useNewUrlParser: true, // -- fix
      // useUnifiedTopology: true // -- fix
    })
  } catch (error) {
    console.log('DB failed to connect!\n', error)
  }
}

module.exports = connectDB