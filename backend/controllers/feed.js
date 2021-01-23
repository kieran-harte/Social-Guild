const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * @desc		Get feed for logged in user
 * @route		GET /api/v1/feed
 * @access	Public
 */
exports.getFeed = asyncHandler(async (req, res, next) => {
  const posts = await pool.queryMany(
    `
		SELECT 
			users.first_name,
			users.last_name,
			users.image,
			posts.*
		FROM following
		JOIN posts ON following.target=posts.user_id
		JOIN users ON following.target=users.id
		WHERE following.user_id=$1
		ORDER BY created_at DESC
	`,
    [req.user.id]
  )

  res.status(200).json({
    success: true,
    data: posts
  })
})
