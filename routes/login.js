const express = require('express')
const router = express.Router()
const userLogin = require('../controllers/userLogin')

router.post('/', userLogin)

module.exports = router