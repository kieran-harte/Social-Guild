const express = require('express')
const multer = require('multer')
const { protect } = require('../middleware/auth')
const {
  getPosts,
  getProfile,
  getFollowers,
  getFollowing,
  getUsers,
  unfollowUser,
  uploadProfilePic,
  shrinkImage
} = require('../controllers/users')

const mult = multer()
const router = express.Router()

router
  .get('/', protect, getUsers)
  .get('/posts', protect, getPosts)
  .get('/:id/posts', protect, getPosts)
  .get('/profile', protect, getProfile)
  .get('/:id/profile', protect, getProfile)
  .get('/:id/followers', protect, getFollowers)
  .get('/:id/following', protect, getFollowing)
  .delete('/:id/unfollow', protect, unfollowUser)
  .post(
    '/uploadprofilepicture',
    protect,
    mult.array('inputFile'),
    shrinkImage,
    uploadProfilePic
  )

module.exports = router
