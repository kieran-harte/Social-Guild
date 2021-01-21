const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * @desc		Get feed for logged in user
 * @route		GET /api/v1/feed
 * @access	Public
 */
exports.getFeed = asyncHandler(async (req, res, next) => {
  // TODO incomplete
})
