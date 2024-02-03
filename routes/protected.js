const express = require('express')
const router = express.Router()
const User = require('../models/userSchema')
const ROLES = require('../config/roles')
const authorizedRoles = require('../middleware/authorizedRoles')

// ----  Protected User Routes ---- //

// Account //
router.get('/account', authorizedRoles(ROLES.User), async (req, res) => {
  // Check for jwt cookie //
  const cookies = req?.cookies
  try {
    if (!cookies.jwt) return res.status(401).json({ message: 'Unauthorized: Please Login.'})
    const refreshToken = cookies.jwt

    const userExists = await User.findOne({ refreshToken }).exec()
    if (!userExists) return res.status(403).json({ message: 'Forbidden: Please Login again.'})
    
    // Send user account data //
    return res.json({ data: userExists })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err.message })
  }
})

// Password Change //
router.post('/passwordChange', authorizedRoles(ROLES.User), require('../controllers/userPassChange'))
// UserInfo Update //


// ---- Protected Admin Routes ---- //
// @TODO: create admin routes


module.exports = router