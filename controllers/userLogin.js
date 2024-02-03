const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userLogin = async (req, res) => {
  if (!req?.body?.username || !req?.body?.password) {
    return res.status(400).json({ message: 'username & password are required!'})
  }
  const username = req?.body?.username
  const password = req?.body?.password

  // Check username exists //
  const validUser = await User.findOne({ username: username}).exec()
  if (!validUser) {
    return res.status(401).json({ message: 'Not a valid Username!'})
  }

  // Check password is a match //
  const validPass = await bcrypt.compare(password, validUser.password)
  if (!validPass) {
    return res.status(401).json({ message: 'Not a valid Password!'})
  }

  if (validPass) {
    try {
      // Update Login Date //
      const date = new Date()
      const newDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`
      validUser.loginOldDate = validUser.loginNewDate || 'New user!'
      validUser.loginNewDate = newDate.slice(0,-1)
      // @TODO: time string to hhmmss format

      // Create jwt access token //
      const accessToken = jwt.sign({
        // Payload //
        "UserInfo": {
          "username": validUser.username,
          "roles": validUser.roles
        },
      }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600s" }    
      )
      
      // Create jwt refresh token //
      const refreshToken = jwt.sign({
        // Payload //
        "username": validUser.username
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d"}
      )
      
      // Save jwt refresh token //
      validUser.refreshToken = refreshToken
      await validUser.save()

      // Send jwt to Front-End //
      res.cookie('jwt', refreshToken, {
        httpOnly: true, 
        sameSite: 'None',  // @FIX: HttpCookie
        secure: true,      // @FIX: HttpCookie
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json({ accessToken })

    } catch (error) {
      console.error(error)
    }
  } else {
    return res.sendStatus(401)
  }
}
  
module.exports = userLogin