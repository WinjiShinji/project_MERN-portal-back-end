const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')

const userRefresh = async (req, res) => {
  const cookies = req?.cookies
  // Check for jwt cookies //
  if (!cookies?.jwt) {
    return res.status(204).json({ message: 'No jwt cookie found'})
  }
  const refreshToken = cookies?.jwt
  
  // Find user with matching refresh token //
  const userExists = await User.findOne({ refreshToken }).exec()
  if (!userExists) {
    return res.status(403).json({ message: 'No user exists!' })
  }

  try {
    // Evaluate refresh token //
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        // Verified //
        if (err) {
          return res.status(403).json({ message: 'Invalid Token!' })
        }
        if (userExists._id.toString() !== decoded._id) {
          return res.status(403).json({ message: '_id invalid' })
        }

        // Create access token //
        const accessToken = jwt.sign(
          {
          // Payload //
          "UserInfo": {
            "_id": decoded._id,
            "roles": userExists.roles
            }
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '600s'}
        )

        // Send access token to Front-End //
        res.json({ accessToken}) 
      }
    )
  } catch (error) {
    serverLogging("Create Tokens", "userRefresh.js", 500)
    return res.sendStatus(500)
  }
}

module.exports = userRefresh