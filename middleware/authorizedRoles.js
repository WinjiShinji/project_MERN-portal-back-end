const User = require('../models/userSchema')

const authorizedRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    // Header Check //
    const user = req?.user
    const roles = req?.roles
    if (!user || !roles) return res.status(403).json({ message: 'No user or role permissions!'})

    // Verify user & roles Info //
    try {
      const userExists = await User.findOne({ username: user }).exec()
      if (!userExists) return res.status(401).json({ message: `User ${user} does not exist in DB!`})
      if (!userExists.roles === roles) return res.status(401).json({ message: `User ${user} roles do not match DB!`})
    } catch (error) {
      console.error(error)
    }

    // Compare Role Permissions //
    try {
      const validRoles = allowedRoles.map(role => (
        Object.values(roles).includes(role)
      ))
      if (!validRoles) return res.status(403).json({ message: 'Forbidden: You do not have sufficient permission!'})
    } catch (error) {
      console.error(error)
    }
    
    next()
  }
}

module.exports = authorizedRoles