const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');

// @desc    GET courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    
	//Finding resources
	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId })
	} else {
		query = Course.find().populate({
			path: 'bootcamp',
			select:'name description'
		});
	}
	const courses = await query;

	//Response
	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});
