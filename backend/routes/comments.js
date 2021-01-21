const express = require('express')
const {
  // getComment,
  getComments,
  addComment,
  editComment,
  deleteComment
} = require('../controllers/comments')
const { protect, checkPostAccess } = require('../middleware/auth')

const router = express.Router()

router
  .route('/:postId')
  .get(protect, checkPostAccess, getComments)
  .post(protect, checkPostAccess, addComment)

router
  .route('/:id')
  // .get(protect, getComment)
  .put(protect, editComment)
  .delete(protect, deleteComment)

module.exports = router
