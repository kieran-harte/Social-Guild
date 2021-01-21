const express = require('express')
const { getLikes, likePost, unlikePost } = require('../controllers/likes')
const { protect, checkPostAccess } = require('../middleware/auth')

const router = express.Router()

router
  .route('/:postId')
  .get(protect, checkPostAccess, getLikes)
  .post(protect, checkPostAccess, likePost)
  .delete(protect, checkPostAccess, unlikePost)

module.exports = router
