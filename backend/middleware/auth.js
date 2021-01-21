const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('./async')

module.exports = {
  // Protect routes - sign in required
  protect: asyncHandler(async (req, res, next) => {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1]
    }
    // Set token from cookie
    else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
      // Verify token
      const payload = jwt.verify(token, process.env.JWT_SECRET)

      const user = await pool.query('SELECT * FROM "Users" WHERE id = $1', [
        payload.id
      ])

      // Check user still exists
      if (!user.rows.length) throw new Error()

      // Save user details to request object so it can easily be accessed in the controllers
      req.user = user.rows[0]

      return next()
    } catch (err) {
      return next(new ErrorResponse('Not authorized to access this route', 401))
    }
  })
}
