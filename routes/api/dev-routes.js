const router = require('express').Router();

// /api/dev

const {
    devEditUser,
    devEditPlaylist,
    devDeleteUser,
    devDeletePlaylist
} = require('../../controllers/dev-controller');

router.route('/users/:id').put(devEditUser).delete(devDeleteUser);
router.route('/playlists/:id').put(devEditPlaylist).delete(devDeletePlaylist);

module.exports = router;