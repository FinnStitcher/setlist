const router = require('express').Router();

// /

const userViews = require('./user-views');
const playlistViews = require('./playlist-views');
const songViews = require('./song-views');

router.use('/', userViews);
router.use('/', playlistViews);
router.use('/', songViews);

router.get('/', async (req, res) => {
    const {loggedIn} = req.session;

    if (loggedIn) {
        window.location.assign('/playlists');
    } else {
        res.render('homepage', {loggedIn});
    }
});

module.exports = router;