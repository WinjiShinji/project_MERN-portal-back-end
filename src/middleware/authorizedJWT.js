const jwt = require('jsonwebtoken')
const serverLogging = require('../logging/serverLogging')

const authorizedJWT = (req, res, next) => {
  // Verify Header Auth //
  const authHeader = req?.headers?.authorization || req?.headers?.Authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'no auth header!' })
  }

  try {
    // Split Token from string //
    const authToken = authHeader.split(' ')[1]
    
    // Verify Authorization Token //
    jwt.verify(
      authToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.status(403).json({ message: 'authToken does not match!'})
        req._id = decoded.UserInfo._id
      req.roles = decoded.UserInfo.roles
    })
  } catch(err) {
    serverLogging("Verify Auth Token", "authorizedJWT.js", 500)
    return res.sendStatus(500)
  }

  next()
}

module.exports = authorizedJWT