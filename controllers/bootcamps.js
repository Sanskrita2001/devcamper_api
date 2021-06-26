const Bootcamp = require('../models/Bootcamp');

// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

// @desc    GET single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Show bootcamp with id ${req.params.id}` });
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({ success: true, data: bootcamp });
	} catch (error) {
		console.log(error)
		res.status(400).json({success:false})
	}
	
	
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Update bootcamp with id ${req.params.id}` });
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Delete bootcamp with id ${req.params.id}` });
};
