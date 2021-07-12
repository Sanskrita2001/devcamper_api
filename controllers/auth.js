const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models//User');
const sendEmail = require('../utils/sendEmail');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	//Create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	//Token and Response
	sentTokenResponse(user, 200, res);
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//Validate email and password
	if (!email || !password) {
		return next(new ErrorResponse('Please enter an email and password', 400));
	}

	//Check for user
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return next(new ErrorResponse('Invalid Credential', 401));
	}

	//Match Passwords
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('Invalid Credential', 401));
	}

	//Token and Response
	sentTokenResponse(user, 200, res);
});

// @desc    Get logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

// Get token from model,create cookie and send response
const sentTokenResponse = (user, statusCode, res) => {
	//Create token
	const token = user.getSignedJwtToken();
	//Options
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}
	//Send response
	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({ success: true, token });
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorResponse('There is no user with that email', 404));
	}

	//Get reset token
	const resetToken = user.getResetPasswordToken();

	console.log(resetToken);

	//Create reset url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/resetpassword/${resetToken}`;

	const message = `You are receiving this message because you or someone else has requested the reset of a password. Please make a PUT request to: \n \n ${resetUrl}`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Password Reset Token',
			message,
		});
		res.status(200).json({
			success: true,
			data: 'Email sent',
		});
	} catch (error) {
		console.log(error);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse('Email couldnt be sent', 500));
	}
});
