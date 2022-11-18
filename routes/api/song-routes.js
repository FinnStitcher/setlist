const router = require('express').Router();

// /api/songs

const {getAllSongs, getOneSong, postSong} = require('../../controllers/song-controller');

router.route('/').get(getAllSongs).post(postSong);
router.route('/:id').get(getOneSong);

module.exports = router;