const express = require('express')
const { getFeed } = require('../controllers/feed')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, getFeed)

module.exports = router
