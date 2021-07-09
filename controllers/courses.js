const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    GET courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {

	//Finding resources
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		//Response
		res.status(200).json(res.advancedResults);
	}
});

// @desc    GET single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});
	if (!course) {
		return next(
			new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: course });
});

// @desc    Create new course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;
	const bootcamp = await Bootcamp.findById(req.params.bootcampId);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	//Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to add a course to bootcamp of id ${bootcamp._id}`,
				401
			)
		);
	}
	const course = await Course.create(req.body);
	res.status(201).json({ success: true, data: course });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id;
	let course = await Course.findById(req.params.id);
	if (!course) {
		return next(
			new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
		);
	}
	//Make sure user is course owner
	if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update a course `,
				401
			)
		);
	}
	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({ success: true, data: course });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id;
	const course = await Course.findById(req.params.id);
	if (!course) {
		return next(
			new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
		);
	}
	//Make sure user is course owner
	if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update a course `,
				401
			)
		);
	}
	course.remove();
	res.status(200).json({ success: true, data: {} });
});