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
    return res.sendStatus(403)
  }

  try {
    // Evaluate refresh token //
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        // Verified //
        if (err) {
          return res.sendStatus(403)
        }
        if (userExists.username !== decoded.username) {
          return res.sendStatus(403)
        }

        // Create access token //
        const accessToken = jwt.sign(
          {
          // Payload //
          "UserInfo": {
            "username": decoded.username,
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
    console.error(error)
  }
}

module.exports = userRefresh