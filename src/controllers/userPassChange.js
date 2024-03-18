const User = require('../models/userSchema')
const bcrypt = require('bcrypt')

const userPassChange = async (req, res) => {
  if (!req?.body?._id || !req?.body?.oldPass ||!req?.body?.newPass) {
    return res.status(401).json({ message: 'All fields required!' })
  }

  const _id = req?.body?._id
  const oldPass = req?.body?.oldPass
  const newPass = req?.body?.newPass

  // Check valid user //
  const validUser = await User.findById({ _id }).exec()
  if (!validUser) {
    return res.status(401).json({ message: 'Not a valid User!' })
  }

  // Check valid old password //
  const validOldPass = await bcrypt.compare(oldPass.toString(), validUser.password)
  if (!validOldPass) {
    return res.status(401).json({ message: 'Old password is not valid!' })
  }

  // Check valid new password //
  const passRegEx = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])([\w@#-_=+!£$%^&*]{8,255})$/)
  const validNewPass = passRegEx.test(newPass.toString())
  if (!validNewPass) {
    return res.status(403).json({ message: 'New password is not valid!' })
  }

  // Change users password to new password //
  try {
    // Encrypt new Password //
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPass, saltRounds)

    // Save new password //
    validUser.password = hashedPassword
    await validUser.save()
    
    // Send success message to front-end //
    return res.status(200).json({ message: 'Password update success!'})
  } catch (error) {
    serverLogging("Change passwords", "userPassChange.js", 500)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = userPassChange