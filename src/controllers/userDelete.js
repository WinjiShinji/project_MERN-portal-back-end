const User = require('../models/userSchema')
const bcrypt = require('bcrypt')

const userDelete = async (req, res) => {
  if (!req?.body?._id) {
    return res.status(401).json({ message: 'No _id field!' })
  }
  if (!req?.body?.password) {
    return res.status(401).json({ message: 'No password field!' })
  }
  const _id = req?.body?._id
  const password = req?.body?.password

  // Check Id exists //
  const userExists = await User.findById({ _id }).exec()
  if (!userExists) {
    return res.status(403).json({ message: `User _id:${_id} not found!` })
  }
  
  // Check Valid Password //
  const validPass = await bcrypt.compare(password, userExists.password)
  if (!validPass) {
    return res.status(403).json({ message: 'Invalid password!' })
  }
  
  // Delete Id account //
  if (validPass) {
    try {
      User.deleteOne({ _id: userExists._id }).exec()
      res.status(200).json({ message: 'Account deletion success!' })
    } catch (err) {
      console.error(err)
    }
  } else {
    serverLogging("Delete Id account", "userDelete.js", 500)
    return res.sendStatus(500)
  }
}

module.exports = userDelete