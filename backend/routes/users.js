const express = require('express')
const { protect } = require('../middleware/auth')
const {
  getPosts,
  getProfile,
  getFollowers,
  getFollowing
} = require('../controllers/users')

const router = express.Router()

router
  .get('/:id/posts', protect, getPosts)
  .get('/:id/profile', protect, getProfile)
  .get('/:id/followers', protect, getFollowers)
  .get('/:id/following', protect, getFollowing)

module.exports = router
