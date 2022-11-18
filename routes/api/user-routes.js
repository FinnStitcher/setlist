const router = require('express').Router();

// /api/users

const {getAllUsers, getOneUser, postUser} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers).post(postUser);
router.route('/:id').get(getOneUser);

module.exports = router;