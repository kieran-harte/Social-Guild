const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * @desc		Get user's posts
 * @route		GET /api/v1/users/:id/posts
 * @access	Private
 */
exports.getPosts = asyncHandler(async (req, res, next) => {
  if (req.user.id !== parseInt(req.params.id, 10)) {
    // Cannot view followers of someone you don't follow
    const isFollowing = await pool.queryOne(
      'SELECT * FROM following WHERE user_id=$1 AND target=$2',
      [req.user.id, req.params.id]
    )

    if (!isFollowing)
      return next(
        new ErrorResponse(
          `You are not authorized to access the posts of the user with id ${req.params.id}`,
          403
        )
      )
  }

  const posts = await pool.queryMany('SELECT * FROM posts WHERE user_id=$1', [
    req.params.id
  ])

  // TODO return if the user likes it

  res.status(200).json({
    success: true,
    data: posts
  })
})

/**
 * @desc		Get user's profile
 * @route		GET /api/v1/users/:id/profile
 * @access	Private
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await pool.queryOne(
    'SELECT id, first_name, last_name, image FROM users WHERE id=$1',
    [req.params.id]
  )

  if (!profile)
    return next(
      new ErrorResponse(
        `The user with id ${req.params.id} does not exist.`,
        404
      )
    )

  // Get follower/following count
  const followerCount = await pool.queryOne(
    'SELECT COUNT(target) FROM following WHERE target=$1',
    [req.params.id]
  )
  const followingCount = await pool.queryOne(
    'SELECT COUNT(user_id) FROM following WHERE user_id=$1',
    [req.params.id]
  )

  profile.followers = followerCount || 0
  profile.following = followingCount || 0

  // TODO common followers
  // const commonFollowers = await pool.queryMany('SELECT * FROM following WHERE')

  // Check if we follow them, have requested to follow them, or they have requested to follow us
  const isFollowing = await pool.queryOne(
    'SELECT * FROM following WHERE user_id=$1 AND target=$2',
    [req.user.id, req.params.id]
  )
  const requestedToFollow = await pool.queryOne(
    'SELECT * FROM follow_requests WHERE requested_by=$1 AND target=$2',
    [req.user.id, req.params.id]
  )
  const followRequestReceived = await pool.queryOne(
    'SELECT * FROM follow_requests WHERE requested_by=$1 AND target=$2',
    [req.params.id, req.user.id]
  )

  profile.isFollowing = !!isFollowing
  profile.requestedToFollow = !!requestedToFollow
  profile.followRequestReceived = !!followRequestReceived

  res.status(200).json({
    success: true,
    data: profile
  })
})

/**
 * @desc		Get user's followers
 * @route		GET /api/v1/users/:id/followers
 * @access	Private
 */
exports.getFollowers = asyncHandler(async (req, res, next) => {
  // Must either be viewing your own followers, or those of someone you're following
  if (req.user.id !== parseInt(req.params.id, 10)) {
    // Cannot view followers of someone you don't follow
    const isFollowing = await pool.queryOne(
      'SELECT * FROM following WHERE user_id=$1 AND target=$2',
      [req.user.id, req.params.id]
    )

    if (!isFollowing)
      return next(
        new ErrorResponse(
          `You are not authorized to access the followers of the user with id ${req.params.id}`,
          403
        )
      )
  }

  const followers = await pool.queryMany(
    `SELECT 
			users.id, 
			users.first_name, 
			users.last_name, 
			users.image, 
			following.created_at as followed_at 
		FROM following 
		JOIN users ON following.user_id = users.id 
		WHERE target = $1`,
    [req.params.id]
  )

  res.status(200).json({
    success: true,
    data: followers
  })
})

/**
 * @desc		Get user's following
 * @route		GET /api/v1/users/:id/following
 * @access	Private
 */
exports.getFollowing = asyncHandler(async (req, res, next) => {
  // Must either be viewing your own following, or that of someone you're following
  if (req.user.id !== parseInt(req.params.id, 10)) {
    // Cannot view followers of someone you don't follow
    const isFollowing = await pool.queryOne(
      'SELECT * FROM following WHERE user_id=$1 AND target=$2',
      [req.user.id, req.params.id]
    )

    if (!isFollowing)
      return next(
        new ErrorResponse(
          `You are not authorized to access the following of the user with id ${req.params.id}`,
          403
        )
      )
  }

  const following = await pool.queryMany(
    `SELECT 
			users.id,
			users.first_name, 
			users.last_name, 
			users.image, 
			following.created_at as followed_at 
			FROM following 
		JOIN users ON following.target=users.id 
		WHERE user_id=$1`,
    [req.params.id]
  )

  res.status(200).json({
    success: true,
    data: following
  })
})
