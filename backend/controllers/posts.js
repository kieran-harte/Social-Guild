const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const requiredFields = require('../utils/requiredFields')

/**
 * @desc		Create a new post
 * @route		POST /api/v1/posts
 * @access	Private
 */
exports.createPost = asyncHandler(async (req, res, next) => {
  const { type, content } = req.body

  // TODO if type=image/video, upload

  // Check required fields are present
  if (!requiredFields([type, content]))
    return next(new ErrorResponse('Please fill in all required fields.', 400))

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
  const post = await pool.queryOne('SELECT * FROM posts WHERE id=$1', [
    req.params.id
  ])

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
  const { type, content, media } = req.body

  // check required fields present
  if (!requiredFields([type, content]))
    return next(new ErrorResponse('Please fill in all required fields.', 400))

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
    'UPDATE posts SET type=$1, content=$2, media=$3 WHERE id=$4 RETURNING *',
    [type, content, media || null, req.params.id]
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
