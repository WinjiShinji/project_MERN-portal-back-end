const User = require('../models/userSchema')

const userChangeUsername = async (req, res) => {
  if (!req?.body?._id) {
    return res.status(401).json({ message: 'No userID!' })
  }
  if (!req?.body?.newUsername) {
    return res.status(401).json({ message: 'No newUsername!' })
  }
  const _id = req?.body?._id
  const newUsername = req?.body?.newUsername
  
  const userExists = await User.findById({ _id }).exec()
  if (!userExists) {
    return res.status(403).json({ message: `${userID} is not valid!` })
  }
  
  // Test Strings //
  const usernameRegEx = new RegExp(/^([\w@#-_=+!£$%^&*]{8,255})$/)
  const usernameValid = usernameRegEx.test(newUsername.toString())
  if (!usernameValid) {
    return res.status(403).json({ message: 'newUsername is not valid!' })
  }

  // Check for username duplicate //
  const duplicate = await User.findOne({ username: newUsername }).exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Username already exists!'})
  }

  // Save new username //
  try { 
    userExists.username = newUsername
    userExists.save()
    return res.status(200).json({ message: 'Username Updated!' })
  } catch (err) {
    serverLogging("Save new username", "userChangeUsername.js", 500)
    return res.status(500).json({ message: err})
  }
}

module.exports = userChangeUsername