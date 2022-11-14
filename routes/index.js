const router = require('express').Router();

const {getAllSongs, getOneSong, postSong} = require('../controllers/song-controller');

router.route('/api/songs').get(getAllSongs).post(postSong);
router.route('/api/songs/:id').get(getOneSong);

module.exports = router;