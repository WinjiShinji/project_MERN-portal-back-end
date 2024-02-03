const express = require('express')
const router = express.Router()
const userRefresh = require('../controllers/userRefresh')

router.get('/', userRefresh)

module.exports = router