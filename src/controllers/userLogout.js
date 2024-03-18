const User = require('../models/userSchema')

const userLogout = async (req, res) => {
  const cookies = req?.cookies
  // Check for jwt cookie //
  if (!cookies?.jwt) return res.status(204).json({ message: 'No jwt content!'})
  const refreshToken = cookies.jwt
  
  // Check user exists //
  const userExists = await User.findOne({ refreshToken }).exec()
  if (!userExists) {
    res.clearCookie('jwt', {
      httpOnly: true, 
      sameSite: 'None', secure: true, // @FIX: CORS
    })
    return res.status(204).json({ message: 'No content!'})
  }

  try {
    // Clear refresh cookie //
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None', secure: true, //@FIX: CORS
    })

    // Delete refresh cookie from DB //
    userExists.refreshToken = ''
    await userExists.save()
    
    res.status(200).json({ message: 'Logged out successfully'})

  } catch (error) {
    serverLogging("Clear & delete cookies", "userLogout.js", 500)
    return res.sendStatus(500)
  }
}

module.exports = userLogout