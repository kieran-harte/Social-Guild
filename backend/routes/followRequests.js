const express = require('express')
const { protect } = require('../middleware/auth')
const {
  getRequests,
  getPending,
  makeRequest,
  acceptRequest,
  declineRequest,
  deleteSentRequest
} = require('../controllers/followRequests')

const router = express.Router()

router.route('/').get(protect, getRequests).post(protect, makeRequest)
router.get('/pendingsent', protect, getPending)
router.get('/:id/accept', protect, acceptRequest)
router.get('/:id/decline', protect, declineRequest)
router.delete('/:id', protect, deleteSentRequest)
module.exports = router
