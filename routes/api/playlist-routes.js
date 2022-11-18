const router = require('express').Router();

// /api/playlists

const {
    getAllPlaylists,
    getOnePlaylist,
    postPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
} = require('../../controllers/playlist-controller');

router.route('/').get(getAllPlaylists).post(postPlaylist);
router.route('/:id').get(getOnePlaylist).delete(deletePlaylist);
router.route('/:id/add-song').put(addSongToPlaylist);
router.route('/:id/remove-song').put(removeSongFromPlaylist);

module.exports = router;