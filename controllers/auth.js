const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models//User');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	//Response
	res.status(200).json({success:true});
});