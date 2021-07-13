const express = require('express');
const {
	register,
	login,
	getMe,
	forgotPassword,
	resetPassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

//Add routes
router
	.post('/register', register)
	.post('/login', login)
	.get('/me', protect, getMe)
	.post('/forgotpassword', forgotPassword)
	.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
