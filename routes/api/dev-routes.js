const router = require('express').Router();

// /api/dev

const {
    devEditUser,
    devEditPlaylist
} = require('../../controllers/dev-controller');

router.route('/users/:id').put(devEditUser);
router.route('/playlists/:id').put(devEditPlaylist);

module.exports = router;