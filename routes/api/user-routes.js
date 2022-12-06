const router = require('express').Router();

// /api/users

const {getAllUsers, getOneUser, postUser, loginUser, logoutUser, deleteUser} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers).post(postUser);
router.route('/:id').get(getOneUser).delete(deleteUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

module.exports = router;