const User = require('../models/userSchema')

const userUpdate = async (req, res) => {
  if (!req?.body?.userID) {
    return res.status(401).json({ message: 'No userID'})
  }
  const userID = req?.body?.userID

  // Get userInfo by ID //

  // Update userInfo //

  // Send Response //
  
}

module.exports = userUpdate