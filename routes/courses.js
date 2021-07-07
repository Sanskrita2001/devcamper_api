const express = require('express');
const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/Course');

const { protect } = require('../middleware/auth');

// Add routes
router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourses
	)
	.post(protect, createCourse);

router
	.route('/:id')
	.get(getCourse)
	.put(protect, updateCourse)
	.delete(protect, deleteCourse);

module.exports = router;
