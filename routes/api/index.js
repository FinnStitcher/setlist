const router = require('express').Router();

// /api

const userRoutes = require('./user-routes');
const playlistRoutes = require('./playlist-routes');
const songRoutes = require('./song-routes');
const folderRoutes = require('./folder-routes');
const devRoutes = require('./dev-routes');
const emailRoutes = require('./email-routes');

router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);
router.use('/songs', songRoutes);
router.use('/folders', folderRoutes);
router.use('/dev', devRoutes);
router.use('/email', emailRoutes);

module.exports = router;