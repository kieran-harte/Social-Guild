const express = require('express')
const {
  createPost,
  getPost,
  editPost,
  deletePost
} = require('../controllers/posts')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/', protect, createPost)
router
  .route('/:id')
  .get(protect, getPost)
  .put(protect, editPost)
  .delete(protect, deletePost)

module.exports = router
