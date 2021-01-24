const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const requiredFields = require('../utils/requiredFields')

/**
 * @desc		Add a new comment
 * @route		POST /api/v1/comments/:postId
 * @access	Private
 */
exports.addComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body

  // Check required fields are present
  if (!requiredFields([content]))
    return next(new ErrorResponse('Please fill in all required fields.', 400))

  // Post the comment
  const newComment = await pool.queryOne(
    'INSERT INTO comments (content, user_id, post_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [content, req.user.id, req.params.postId, Date.now()]
  )

  res.status(201).json({
    success: true,
    data: newComment
  })
})

/**
 * @desc		Get comments on a post
 * @route		GET /api/v1/comments/:postId
 * @access	Private
 */
exports.getComments = asyncHandler(async (req, res, next) => {
  // Get comments
  const comments = await pool.queryMany(
    `
		SELECT 
			comments.*,
			users.first_name,
			users.last_name,
			users.image
		FROM comments
		JOIN users ON comments.user_id = users.id
		WHERE post_id=$1 
		ORDER BY created_at DESC`,
    [req.params.postId]
  )

  res.status(200).json({
    success: true,
    data: comments
  })
})

/**
 * @desc		Edit a comment
 * @route		PUT /api/v1/comments/:id
 * @access	Private
 */
exports.editComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body

  if (!requiredFields([content]))
    return next(new ErrorResponse('Content cannot be blank.', 400))

  // Check comment exists and current user is the author
  const comment = await pool.queryOne('SELECT * FROM comments WHERE id=$1', [
    req.params.id
  ])
  if (!comment)
    return next(
      new ErrorResponse(`Comment with id ${req.params.id} does not exist.`, 404)
    )

  if (req.user.id !== parseInt(comment.user_id, 10))
    return next(
      new ErrorResponse(`You are not authorized to edit this comment.`, 403)
    )

  // Edit the comment
  const newComment = await pool.queryOne(
    'UPDATE comments SET content=$1 WHERE id=$2 RETURNING *',
    [content, req.params.id]
  )

  res.status(200).json({
    success: true,
    data: newComment
  })
})

/**
 * @desc		Delete a comment
 * @route		DELETE /api/v1/comments/:id
 * @access	Private
 */
exports.deleteComment = asyncHandler(async (req, res, next) => {
  // Check comment exists and user is the author

  // Check comment exists and current user is the author
  const comment = await pool.queryOne('SELECT * FROM comments WHERE id=$1', [
    req.params.id
  ])
  if (!comment)
    return next(
      new ErrorResponse(`Comment with id ${req.params.id} does not exist.`, 404)
    )

  if (req.user.id !== parseInt(comment.user_id, 10))
    return next(
      new ErrorResponse(`You are not authorized to delete this comment.`, 403)
    )

  // Delete the comment
  await pool.queryOne('DELETE FROM comments WHERE id=$1', [req.params.id])

  res.status(200).json({
    success: true,
    data: {}
  })
})
