const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * @desc		Get likes on a post
 * @route		GET /api/v1/likes/:postId
 * @access	Private
 */
exports.getLikes = asyncHandler(async (req, res, next) => {
  const likes = await pool.queryMany(
    `SELECT 
			likes.created_at,
			likes.user_id,
			users.first_name,
			users.last_name,
			users.image 
		FROM likes
		JOIN users ON likes.user_id = users.id
		WHERE post_id=$1`,
    [req.params.postId]
  )

  res.status(200).json({
    success: true,
    data: likes
  })
})

/**
 * @desc		Like a post
 * @route		POST /api/v1/likes/:postId
 * @access	Private
 */
exports.likePost = asyncHandler(async (req, res, next) => {
  // Like the post
  const like = await pool.queryOne(
    `INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, $3) RETURNING *`,
    [req.user.id, req.params.postId, Date.now()]
  )

  res.status(200).json({
    success: true,
    data: like
  })
})

/**
 * @desc		Unlike a post
 * @route		DELETE /api/v1/likes/:postId
 * @access	Private
 */
exports.unlikePost = asyncHandler(async (req, res, next) => {
  // Like the post
  await pool.queryOne(`DELETE FROM likes WHERE user_id=$1 AND post_id=$2`, [
    req.user.id,
    req.params.postId
  ])

  res.status(200).json({
    success: true,
    data: {}
  })
})
