const express = require('express');
const router = express.Router();
const {
	getUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
} = require('../controllers/users');

const User = require('../models/User');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

//Add routes
router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
