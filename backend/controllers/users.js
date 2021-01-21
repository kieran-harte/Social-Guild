const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * @desc		Get user's posts
 * @route		GET /api/v1/users/:id/posts
 * @access	Private
 */
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await pool.queryMany('SELECT * FROM posts WHERE user_id=$1', [
    req.user.id
  ])

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
  // Can only get limited info if not following
  // return all non-confidential info if following
  // TODO incomplete
})

/**
 * @desc		Get user's followers
 * @route		GET /api/v1/users/:id/followers
 * @access	Private
 */
exports.getFollowers = asyncHandler(async (req, res, next) => {
  // can only get if following
  // TODO incomplete
})

/**
 * @desc		Get user's following
 * @route		GET /api/v1/users/:id/following
 * @access	Private
 */
exports.getFollowing = asyncHandler(async (req, res, next) => {
  // can only get if following
  // TODO incomplete
})
