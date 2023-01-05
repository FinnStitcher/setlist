const router = require('express').Router();

// /api/users

const {getAllUsers, getOneUser, postUser, loginUser, logoutUser} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers).post(postUser);
router.route('/:id').get(getOneUser);
router.route('/login').post(loginUser);
router.route('/logout').delete(logoutUser);

module.exports = router;