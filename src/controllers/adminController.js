const serverLogging = require('../logging/serverLogging')
const User = require('../models/userSchema')

// GET User Data //
const getUser = async (req, res) => {
  if (!req?.query?._id && !req?.query?.username) {
    return res.status(401).json({ message: "_id||username field is empty!" })
  }
  if (req?.query?._id && req?.query?.username) {
    return res.status(401).json({ message: "_id or username, not both!" })
  }

  // Get user by id //
  if (req?.query?._id) {
    const userId = req?.query?._id.toString()

    // Check userId is valid //
    try {
      const regEx = new RegExp(/^([0-9a-f]{24})$/) // hex string check
      const validId = regEx.test(userId)
      
      if (!validId) {
        return res.status(403).json({ message: `id: ${userId} is not valid!` })
      }
      const validUser = await User.findById({ _id: userId }).exec()
      if (!validUser) {
        return res.status(403).json({ message: `id: ${userId} is not a valid user!` })
      }
      
      // Send userInfo //
      if (validUser) {
        return res.status(200).json(validUser)
      } else {
        return res.sendStatus(500)
      }
    } catch (err) {
      serverLogging("Get user by id", "adminController.js", 500)
      return res.sendStatus(500)
    }
  }

  // Get user by username //
  if (req?.query?.username) {
    const username = req?.query?.username.toString()

    // Check username is valid //
    try {
      const validUser = await User.findOne({ username: username }).exec()
      if (!validUser) {
        return res.status(403).json({ message: `${username} is not a valid user!` })
      }
      if (validUser) {
        return  res.status(200).json(validUser)
      } else {
        return res.sendStatus(500)
      }
    } catch (err) {
      serverLogging("Get user by username", "adminController.js", 500)
      return res.sendStatus(500)
    }
  }
}

// UPDATE User Roles //
const userRoleAdmin = async (req, res) => {
  if (!req?.body?._id) {
    return res.status(401).json({ message: '_id params is empty!' })
  }
  const userId = req?.body?._id.toString()
  const adminId = req?._id.toString() || ''

  // Check _id is valid //
  try {
    const regEx = new RegExp(/^([0-9a-f]{24})$/) // hex string check
    const validId = regEx.test(userId)
    const validAdminId = regEx.test(adminId)

    if (!validId) {
      return res.status(403).json({ message: `User _id: ${userId} is not valid!` })
    }
    if (!validAdminId) {
      return res.status(403).json({ message: `Admin _id: ${adminId} is not valid!` })
    }
    if (userId === adminId) {
      return res.status(409).json({ message: 'UserID matches AdminID, conflict!' })
    }

    // Check user exists //
    const validUser = await User.findById({ _id: userId }).exec()
    if (!validUser) {
      return res.status(403).json({ message: `UserID: ${userId} is not a in DB!` })
    }
    if (validUser) {
      // Check existing roles //
      const userRoles = validUser.roles || { User: 5000 }
      if (userRoles.Admin) {
        validUser.roles = { User: 5000 }
        await validUser.save()
        return res.status(201).json({ message: 'Admin Role Removed' })
      } else {
        validUser.roles.Admin = 5400
        await validUser.save()
        return res.status(201).json({ message: 'Admin Role Added' })
      }
    } else {
      return res.sendStatus(500)
    }
  } catch (err) {
    serverLogging("Update user roles", "adminController.js", 500)
    return res.sendStatus(500)
  }

}

// DELETE User Account //
const deleteUser = async (req, res) => {
  if(!req?.query?._id) {
    return res.status(401).json({ message: '_id params missing!' })
  }
  const userId = req?.query?._id.toString()
  const adminId = req?._id.toString() || ''

  try {
    // Check _id is valid //
    const regEx = new RegExp(/^([0-9a-f]{24})$/) // hex string check
    const validUserId = regEx.test(userId)
    const validAdminId = regEx.test(adminId)
    
    if (!validUserId) {
      return res.status(403).json({ message: `User _id: ${userId} is not valid!` })
    }
    if (!validAdminId) {
      return res.status(403).json({ message: `Admin _id: ${adminId} is not valid!` })
    }
    if (userId === adminId) {
      return res.status(409).json({ message: 'UserID matches AdminID, conflict!' })
    }

    // Check User Exists //
    const validUser = await User.findById({ _id: userId }).exec()
    if (!validUser) {
      return res.status(403).json({ message: `UserID: ${userId} is not a in DB!` })
    }
    if (validUser) {
      // Delete User Account //
      await User.deleteOne({ _id: validUser._id }).exec()
      return  res.status(200).json({ message: 'Delete Account Success!' })
    } else {
      return res.sendStatus(500)
    }
  } catch (err) {
    serverLogging("Delete User", "adminController.js", 500)
    return res.sendStatus(500)
  }
}

module.exports = { 
  getUser,
  userRoleAdmin,
  deleteUser

}