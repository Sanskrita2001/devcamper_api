const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models//User');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body
	
	//Create user
	const user = await User.create({
		name,email,password,role
	})

	//Create token
	const token = user.getSignedJwtToken();
	//Response
	res.status(200).json({success:true,token});
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body
	
	//Validate email and password
	if (!email || !password) {
		return next(new ErrorResponse('Please enter an email and password',400))
	}
	
	//Check for user
	const user = await User.findOne({ email }).select('+password')
	if (!user) {
		return next(new ErrorResponse('Invalid Credential',401))
	}

	//Match Passwords
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('Invalid Credential', 401));
	}

	//Create token
	const token = user.getSignedJwtToken();
	//Response
	res.status(200).json({success:true,token});
});