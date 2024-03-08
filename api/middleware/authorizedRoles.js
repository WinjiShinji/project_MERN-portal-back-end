const User = require('../models/userSchema')

const authorizedRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    // Header Check //
    const _id = req?._id
    const roles = req?.roles
    if (!_id || !roles) return res.status(403).json({ message: 'No user or role permissions!'})

    // Verify user & roles Info //
    try {
      const userExists = await User.findById({ _id }).exec()
      if (!userExists) return res.status(401).json({ message: `_id ${_id} does not exist in DB!`})
      if (!userExists.roles === roles) return res.status(401).json({ message: `_id ${_id} roles do not match DB!`})
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