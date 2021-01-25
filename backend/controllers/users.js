const sharp = require('sharp')
const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const { uploadFiles } = require('../utils/storage')

// Shrink image to 512x512
exports.shrinkImage = asyncHandler(async (req, res, next) => {
  try {
    // Shrink image
    const buffer = await sharp(req.files[0].buffer).resize(512).toBuffer()
    req.files[0].buffer = buffer
    next()
  } catch (err) {
    return next(new ErrorResponse(err.message, 500))
  }
})

/**
 * @desc		Upload profile picture
 * @route		POST /api/v1/users/uploadprofilepicture
 * @access	Private
 */
exports.uploadProfilePic = asyncHandler(async (req, res, next) => {
  try {
    console.log('here')
    const results = await uploadFiles([req.files[0]], req.user.id)

    const url = results[0].Location

    const user = await pool.queryOne(
      'UPDATE users SET image=$1 WHERE id = $2 RETURNING *',
      [url, req.user.id]
    )

    res.status(201).json({ success: true, user })
  } catch (err) {
    return next(new ErrorResponse(err.message, 500))
  }
})

/**
 * @desc		Unfollow a user
 * @route		DELETE /api/v1/users/:id/unfollow
 * @access	Private
 */
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  // check you are following them
  const following = await pool.queryOne(
    'SELECT * FROM following WHERE user_id=$1 AND target=$2',
    [req.user.id, req.params.id]
  )
  if (!following)
    return next(new ErrorResponse('You are not following this user.', 400))

  // Delete from following table
  await pool.queryOne('DELETE FROM following WHERE id=$1', [following.id])

  res.status(200).json({
    success: true,
    data: {}
  })
})

/**
 * @desc		Get all users
 * @route		GET /api/v1/users
 * @access	Private
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await pool.queryMany(
    `SELECT 
			users.id, 
			users.first_name, 
			users.last_name, 
			users.image, 
			users.created_at,
			follow_requests.id as follow_request_id,
			following.id as following_id
		FROM users 
		LEFT JOIN follow_requests ON users.id = follow_requests.target AND follow_requests.requested_by = $1
		LEFT JOIN following ON users.id = following.target AND following.user_id = $1
		WHERE users.id != $1 
		LIMIT 10`,
    [req.user.id]
  )

  res.status(200).json({
    success: true,
    users
  })
})

/**
 * @desc		Get user's posts
 * @route		GET /api/v1/users/:id/posts
 * @access	Private
 */
exports.getPosts = asyncHandler(async (req, res, next) => {
  if (req.params.id === undefined) req.params.id = req.user.id

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

  const posts = await pool.queryMany(
    `select
			posts.*,
			u.first_name,
			u.last_name,
			u.image as profile_pic,
			coalesce(com.count, 0) as comment_count,
			coalesce(li.count, 0) as like_count,
			my_likes.id as my_like_id
		from
			posts
		join (
			select
				users.*
			from
				users
			where
				users.id = $1) as u on
			posts.user_id = u.id
		left join (
			select
				post_id,
				cast(count(id) as integer)
			from
				likes
			group by
				post_id) as li on
			posts.id = li.post_id
		left join (
			select
				*
			from
				likes
			where
				likes.user_id = $2) as my_likes on
			posts.id = my_likes.post_id
		left join (
			select
				post_id,
				cast(count(id) as integer)
			from
				comments
			group by
				post_id ) as com on
			posts.id = com.post_id
		order by
			created_at desc
		limit 25
	`,
    [req.params.id, req.user.id]
  )

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
  if (req.params.id === undefined) req.params.id = req.user.id

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

  profile.following_id = (isFollowing || {}).id
  profile.follow_request_id = (requestedToFollow || {}).id
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
