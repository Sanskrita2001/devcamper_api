const express = require('express');
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampInRadius,
	bootcampPhotoUpload,
} = require('../controllers/bootcamps');

//Include other resource routers
const courseRouter = require('./courses')

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

// Add routes
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router
	.route('/')
	.get(getBootcamps)
	.post(createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
