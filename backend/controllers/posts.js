const sharp = require('sharp')
const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const requiredFields = require('../utils/requiredFields')
const { uploadFiles } = require('../utils/storage')

// Shrink image to 512x512
exports.shrinkImage = asyncHandler(async (req, res, next) => {
  if (req.body.type !== 'image') return next()
  try {
    // Shrink image
    const buffer = await sharp(req.files[0].buffer).resize(1024).toBuffer()
    req.files[0].buffer = buffer
    next()
  } catch (err) {
    return next(new ErrorResponse(err.message, 500))
  }
})

/**
 * @desc		Upload Media
 * @route		POST /api/v1/posts/media
 * @access	Private
 */
exports.uploadMedia = asyncHandler(async (req, res, next) => {
  try {
    const results = await uploadFiles([req.files[0]], req.user.id)

    const url = results[0].Location

    // Add url to request body to pass on to createPost
    req.body.media = url
    next()
  } catch (err) {
    return next(new ErrorResponse(err.message, 500))
  }
})

/**
 * @desc		Create a new post
 * @route		POST /api/v1/posts
 * @access	Private
 */
exports.createPost = asyncHandler(async (req, res, next) => {
  const { type, content } = req.body

  // TODO if type=image/video, upload

  // Check required fields are present
  if (!requiredFields([type]))
    return next(new ErrorResponse('Please add a post type', 400))
  if (type === 'text' && !requiredFields([content]))
    return next(new ErrorResponse('Please add some content', 400))

  console.log('posting with media url:', req.body.media)

  const newPost = await pool.queryOne(
    'INSERT INTO posts (type, content, media, "created_at", user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [type, content, req.body.media || null, Date.now(), req.user.id]
  )

  res.status(201).json({
    success: true,
    data: newPost
  })
})

/**
 * @desc		Get a post
 * @route		GET /api/v1/posts/:id
 * @access	Private
 */
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await pool.queryOne(
    `SELECT 
			posts.id, 
			posts.user_id, 
			posts.type, 
			posts.content, 
			posts.media, 
			posts.created_at,
			users.first_name,
			users.last_name 
		FROM posts 
		JOIN users ON users.id = posts.user_id 
		WHERE id=$1`,
    [req.params.id]
  )

  // check the post exists
  if (!post)
    return next(
      new ErrorResponse(`The post with id ${req.params.id} does not exist`, 404)
    )

  // TODO incomplete
  // Check the user is allowed to access it
  // if user is following requested users post, or it is their own post, they can see it, or if the user's profile is public

  if (post.user_id !== req.user.id)
    return next(
      new ErrorResponse('You are not authorized to view this post.', 403)
    )

  // TODO return if the user likes it

  res.status(200).json({
    success: true,
    data: post
  })
})

/**
 * @desc		Edit a post
 * @route		PUT /api/v1/posts/:id
 * @access	Private
 */
exports.editPost = asyncHandler(async (req, res, next) => {
  const { type, content } = req.body

  // check required fields present
  if (!requiredFields([type]))
    return next(new ErrorResponse('Please specify the post type.', 400))
  if (type === 'text' && !requiredFields([content]))
    return next(new ErrorResponse('Please add some content.', 400))

  const post = await pool.queryOne('SELECT * FROM posts WHERE id=$1', [
    req.params.id
  ])

  // check the post exists
  if (!post)
    return next(
      new ErrorResponse(`The post with id ${req.params.id} does not exist`, 404)
    )

  // Check it is their post
  if (post.user_id !== req.user.id)
    return next(
      new ErrorResponse(`You are not authorized to edit this post.`),
      403
    )

  const updatedPost = await pool.queryOne(
    'UPDATE posts SET type=$1, content=$2 WHERE id=$3 RETURNING *',
    [type, content, req.params.id]
  )

  res.status(200).json({
    success: true,
    data: updatedPost
  })
})

/**
 * @desc		Delete post
 * @route		DELETE /api/v1/posts/:id
 * @access	Private
 */
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await pool.queryOne('SELECT * FROM posts WHERE id=$1', [
    req.params.id
  ])

  // check the post exists
  if (!post)
    return next(
      new ErrorResponse(`The post with id ${req.params.id} does not exist`, 404)
    )

  // Check it is their post
  if (post.user_id !== req.user.id)
    return next(
      new ErrorResponse(`You are not authorized to edit this post.`),
      403
    )

  await pool.query('DELETE FROM posts WHERE id=$1 RETURNING *', [req.params.id])

  res.status(200).json({
    success: true,
    data: {}
  })
})
