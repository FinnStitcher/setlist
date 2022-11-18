const router = require('express').Router();

const {getAllUsers, getOneUser, postUser} = require('../controllers/user-controller');
const {getAllPlaylists, getOnePlaylist, postPlaylist, deletePlaylist} = require('../controllers/playlist-controller');
const {getAllSongs, getOneSong, postSong} = require('../controllers/song-controller');

router.route('/api/songs').get(getAllSongs).post(postSong);
router.route('/api/songs/:id').get(getOneSong);

router.route('/api/users').get(getAllUsers).post(postUser);
router.route('/api/users/:id').get(getOneUser);

router.route('/api/playlists').get(getAllPlaylists).post(postPlaylist);
router.route('/api/playlists/:id').get(getOnePlaylist).delete(deletePlaylist);

module.exports = router;