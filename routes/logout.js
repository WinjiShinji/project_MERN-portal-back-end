const express = require('express')
const router = express.Router()
const userLogout = require('../controllers/userLogout')

router.get('/', userLogout)

module.exports = router