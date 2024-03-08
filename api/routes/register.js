const express = require('express')
const router = express.Router()
const registerController = require('../controllers/userRegister')

router.post('/', registerController)

module.exports = router