const router = require('express').Router();

// /api/songs

const {
    getAllSongs,
    getOneSong,
    getSongsByUser,
    searchSongs,
    matchSongs,
    postSong,
    putSong
} = require('../../controllers/song-controller');

router.route('/').get(getAllSongs).post(postSong);
router.route('/match').get(matchSongs);
router.route('/search/user').get(getSongsByUser);
router.route('/search/:search').get(searchSongs);
router.route('/:id').get(getOneSong).put(putSong);

module.exports = router;