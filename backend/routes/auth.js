const express = require('express')
const {
  register,
  login,
  logout,
  myDetails,
  updatePassword,
  updateDetails
} = require('../controllers/auth')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', protect, logout)
router.get('/mydetails', protect, myDetails)
router.put('/updatepassword', protect, updatePassword)
router.put('/updatedetails', protect, updateDetails)
// TODO reset password

module.exports = router
