const express = require('express')
const multer = require('multer')
const {
  uploadMedia,
  createPost,
  getPost,
  editPost,
  deletePost,
  shrinkImage
} = require('../controllers/posts')
const { protect } = require('../middleware/auth')

const mult = multer()
const router = express.Router()

router.post('/', protect, createPost)
// Media post
router
  .route('/media')
  .post(protect, mult.array('inputFile'), shrinkImage, uploadMedia, createPost)

router
  .route('/:id')
  .get(protect, getPost)
  .put(protect, editPost)
  .delete(protect, deletePost)

module.exports = router
