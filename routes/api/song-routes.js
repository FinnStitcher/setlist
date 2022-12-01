const router = require('express').Router();

// /api/songs

const {
    getAllSongs,
    getOneSong,
    searchSongs,
    postSong
} = require('../../controllers/song-controller');

router.route('/').get(getAllSongs).post(postSong);
router.route('/:id').get(getOneSong);
router.route('/search/:search').get(searchSongs);

module.exports = router;