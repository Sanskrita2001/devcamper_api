const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    GET reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
	//Finding resources
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });
		res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		//Response
		res.status(200).json(res.advancedResults);
	}
});

// @desc    GET single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});
	if (!review) {
		return next(
			new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: review });
});

// @desc    Create new review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({ success: true, data: review });
});

// @desc    Update reviews
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id);
	if (!review) {
		return next(
			new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
		);
	}
	//Make sure user is review owner
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update a Review `,
				401
			)
		);
	}
	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({ success: true, data: review });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);
	if (!review) {
		return next(
			new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
		);
	}
	//Make sure user is review owner
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update a Review `,
				401
			)
		);
	}
	review.remove();
	res.status(200).json({ success: true, data: {} });
});
