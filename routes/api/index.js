const router = require('express').Router();

// /api

const userRoutes = require('./user-routes');
const playlistRoutes = require('./playlist-routes');
const songRoutes = require('./song-routes');

router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);
router.use('/songs', songRoutes);

module.exports = router;