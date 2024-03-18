const Users = require('../models/userSchema')
const bcrypt = require('bcrypt')

const userRegister = async (req, res) => {
  // Invalid Parameters //
  if (!req?.body?.username || !req?.body?.password) {
    return res.status(400).json({ message: 'Username & Password are required!'})
  }
  const username = req?.body?.username
  const password = req?.body?.password
  
  // Test Strings //
  const usernameRegEx = new RegExp(/^([\w@#-_=+!£$%^&*]{8,255})$/)
  const passwordRegEx = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])([\w@#-_=+!£$%^&*]{8,255})$/)
  const usernameValid = usernameRegEx.test(username.toString())
  const passwordValid = passwordRegEx.test(password.toString())
  if (usernameValid !== true) {
    return res.status(406).json({ message: 'Username is invalid!' })
  }
  if (passwordValid !== true) {
    return res.status(406).json({ message: 'Password is invalid!'})
  }

  // Duplicate User Check //
  const duplicate = await Users.findOne({ username: req?.body?.username }).exec()
  if (duplicate) return res.status(409).json({ message: `"${req?.body?.username}" already exists!`})

  try {
    // Encrypt Password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // Create & Store User //
    Users.create({
      "username": username,
      "password": hashedPassword
    })

    res.status(201).json({ message: `"${username}" was created successfully!`})
  } catch (error) {
    serverLogging("Register User", "userRegister.js", 500)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = userRegister