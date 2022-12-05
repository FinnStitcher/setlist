const router = require('express').Router();

// /api/playlists

const {
    getAllPlaylists,
    getOnePlaylist,
    postPlaylist,
    editPlaylist,
    deletePlaylist
} = require('../../controllers/playlist-controller');

router.route('/').get(getAllPlaylists).post(postPlaylist);
router.route('/:id').get(getOnePlaylist).put(editPlaylist).delete(deletePlaylist);

module.exports = router;