const bcrypt = require('bcrypt')
const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const genJWT = require('../utils/generateJWT')

const requiredFields = require('../utils/requiredFields')

const sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const jwtToken = genJWT(user.id)

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  // Set secure if in production
  if (process.env.NODE_ENV === 'prod') options.secure = true

  res
    .status(statusCode)
    .cookie('token', jwtToken, options)
    .json({ success: true, token: jwtToken, user })
}

/**
 * @desc		Register user
 * @route		POST /api/v1/auth/register
 * @access	Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body

  // Check required fields filled in
  if (!requiredFields([first_name, email, password]))
    return next(new ErrorResponse('Please fill in all required fields.', 400))

  // Check email isn't already registered
  const user = await pool.query('SELECT * FROM "Users" WHERE email = $1', [
    email
  ])

  if (user.rows.length)
    return next(new ErrorResponse('Email already in use.', 401))

  // Register user
  const salt = await bcrypt.genSalt(12)
  const encryptedPassword = await bcrypt.hash(password, salt)

  const newUser = await pool.query(
    'INSERT INTO "Users" (first_name, last_name, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [first_name, last_name || '', email, encryptedPassword, Date.now()]
  )

  return sendTokenResponse(newUser.rows[0], 201, res)
})

/**
 * @desc		Log user in
 * @route		POST /api/v1/auth/login
 * @access	Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!requiredFields([email, password]))
    return next(new ErrorResponse('Please provide an email and password.', 400))

  // Check user exists
  const user = await pool.query('SELECT * FROM "Users" WHERE email = $1', [
    email
  ])
  if (!user.rows.length)
    return next(new ErrorResponse('Invalid credentials', 401))

  // Check password is correct
  const passwordValid = await bcrypt.compare(password, user.rows[0].password)
  if (!passwordValid) return next(new ErrorResponse('Invalid credentials', 401))

  // Send token
  return sendTokenResponse(user.rows[0], 200, res)
})

/**
 * @desc		Log user out
 * @route		GET /api/v1/auth/logout
 * @access	Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    data: {}
  })
})

/**
 * @desc		Get logged in user's details
 * @route		GET /api/v1/auth/mydetails
 * @access	Private
 */
exports.myDetails = asyncHandler(async (req, res, next) => {
  const user = await pool.query('SELECT * FROM "Users" WHERE id=$1', [
    req.user.id
  ])

  res.status(200).json({
    success: true,
    data: user.rows[0]
  })
})

/**
 * @desc		Update Password
 * @route		PUT /api/v1/auth/updatepassword
 * @access	Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  // Check fields are filled in
  if (!requiredFields([currentPassword, newPassword]))
    return next(
      new ErrorResponse(
        'Please provide your current password and a new password',
        400
      )
    )

  // Check currentPassword is correct
  console.log(req.user)
  const match = await bcrypt.compare(currentPassword, req.user.password)
  if (!match) return next(new ErrorResponse('Password is incorrect', 401))

  // Hash the new password
  const salt = await bcrypt.genSalt(12)
  const encryptedPassword = await bcrypt.hash(newPassword, salt)

  // Set new password
  const user = await pool.query(
    'UPDATE "Users" SET password = $1 WHERE id = $2 RETURNING *',
    [encryptedPassword, req.user.id]
  )

  sendTokenResponse(user.rows[0], 200, res)
})

/**
 * @desc		Update User Details
 * @route		PUT /api/v1/auth/updatedetails
 * @access	Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email } = req.body

  // check required fields are present
  if (!requiredFields([first_name, last_name, email]))
    return next(new ErrorResponse('Please fill in all required fields.', 400))

  const user = await pool.query(
    'UPDATE "Users" SET first_name=$1, last_name=$2, email=$3 WHERE id=$4 RETURNING *',
    [first_name, last_name, email, req.user.id]
  )

  res.status(200).json({
    success: true,
    data: user.rows[0]
  })
})
