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
