const jwt = require('jsonwebtoken')

module.exports = (user_id) => {
  const payload = {
    id: user_id
  }

  console.log('expires in ', process.env.JWT_EXPIRE)

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}
