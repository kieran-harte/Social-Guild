const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const requiredFields = require('../utils/requiredFields')

/**
 * @desc		Request to follow another user
 * @route		POST /api/v1/requests
 * @access	Private
 */
exports.makeRequest = asyncHandler(async (req, res, next) => {
  const { target } = req.body

  // Check a target is specified
  if (!requiredFields([target]))
    return next(new ErrorResponse(`Please provide a target user.`, 400))

  // make sure the requested user exists
  const targetUser = await pool.queryOne('SELECT * FROM users WHERE id=$1', [
    target
  ])

  if (!targetUser)
    return next(new ErrorResponse(`The user ${target} does not exist.`, 404))

  // Check a request hasn't already been sent
  const existingRequest = await pool.queryOne(
    'SELECT * FROM follow_requests WHERE requested_by=$1 AND target=$2',
    [req.user.id, target]
  )
  if (existingRequest)
    return next(
      new ErrorResponse(`You have already requested to follow the user.`, 400)
    )

  // add requets to requests table
  const followReq = await pool.queryOne(
    'INSERT INTO follow_requests (requested_by, target, created_at) VALUES ($1, $2, $3) RETURNING *',
    [req.user.id, target, Date.now()]
  )

  // TODO possibly add notification, or just show any pending requests as non-dismissable notifications
  res.status(200).json({
    success: true,
    data: followReq
  })
})

/**
 * @desc		Get requests to follow me
 * @route		GET /api/v1/requests
 * @access	Private
 */
exports.getRequests = asyncHandler(async (req, res, next) => {
  const requests = await pool.queryMany(
    `SELECT 
			follow_requests.created_at,
			follow_requests.id as request_id, 
			users.first_name, 
			users.last_name, 
			users.image,
			users.id as id
		FROM follow_requests 
		JOIN users ON follow_requests.requested_by=users.id 
		WHERE target=$1`,
    [req.user.id]
  )

  res.status(200).json({
    success: true,
    data: requests
  })
})

/**
 * @desc		Get sent follow requests which haven't been confirmed or declined
 * @route		GET /api/v1/requests/pendingsent
 * @access	Private
 */
exports.getPending = asyncHandler(async (req, res, next) => {
  const requests = await pool.queryMany(
    `SELECT 
			follow_requests.*, 
			users.first_name, 
			users.last_name, 
			users.image 
		FROM follow_requests 
		JOIN users ON follow_requests.target=users.id 
		WHERE requested_by=$1`,
    [req.user.id]
  )

  res.status(200).json({
    success: true,
    data: requests
  })
})

/**
 * @desc		Accept a request
 * @route		GET /api/v1/requests/:id/accept
 * @access	Private
 */
exports.acceptRequest = asyncHandler(async (req, res, next) => {
  // Delete the follow request if it still exists
  const request = await pool.queryOne(
    'DELETE FROM follow_requests WHERE target=$1 AND id=$2 RETURNING *',
    [req.user.id, req.params.id]
  )

  if (!request)
    return next(
      new ErrorResponse(
        `The request with id ${req.params.id} is invalid or the user has deleted their request.`,
        404
      )
    )

  // Add to following table
  const result = await pool.queryOne(
    'INSERT INTO following (user_id, target, created_at) VALUES ($1, $2, $3) RETURNING *',
    [request.requested_by, req.user.id, Date.now()]
  )

  res.status(200).json({
    success: true,
    data: result
  })
})

/**
 * @desc		Decline a requets
 * @route		GET /api/v1/requests/:id/decline
 * @access	Private
 */
exports.declineRequest = asyncHandler(async (req, res, next) => {
  // Delete the follow request
  const request = await pool.queryOne(
    'DELETE FROM follow_requests WHERE target=$1 AND id=$2 RETURNING *',
    [req.user.id, req.params.id]
  )

  if (!request)
    return next(
      new ErrorResponse(
        `Could not delete. The request with id ${req.params.id} does not exist.`,
        404
      )
    )

  // TODO send the requester a notification saying it has been declined

  res.status(200).json({
    success: true,
    data: {}
  })
})

/**
 * @desc		Delete a sent requets
 * @route		DELETE /api/v1/requests/:id
 * @access	Private
 */
exports.deleteSentRequest = asyncHandler(async (req, res, next) => {
  // Delete the follow request
  const request = await pool.queryOne(
    'DELETE FROM follow_requests WHERE id=$1 AND requested_by=$2 RETURNING *',
    [req.params.id, req.user.id]
  )

  if (!request) return next(new ErrorResponse(`Could not delete request`, 404))

  res.status(200).json({
    success: true,
    data: {}
  })
})
