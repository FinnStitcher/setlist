const router = require('express').Router();

// /api

const userRoutes = require('./user-routes');
const playlistRoutes = require('./playlist-routes');
const songRoutes = require('./song-routes');
const devRoutes = require('./dev-routes');

router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);
router.use('/songs', songRoutes);
router.use('/dev', devRoutes);

module.exports = router;