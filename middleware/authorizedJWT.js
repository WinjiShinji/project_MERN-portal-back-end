const jwt = require('jsonwebtoken')

const authorizedJWT = (req, res, next) => {
  // Verify Header Auth //
  const authHeader = req?.headers?.authorization || req?.headers?.Authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'no auth header!' })
  }

  // Split Token from string //
  const authToken = authHeader.split(' ')[1]

  // Verify Authorization Token //
  jwt.verify(
    authToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: 'authToken does not match!'})
      req.user = decoded.UserInfo.username
      req.roles = decoded.UserInfo.roles
      next()
    }
  )
}

module.exports = authorizedJWT