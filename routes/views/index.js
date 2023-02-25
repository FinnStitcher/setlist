const router = require('express').Router();
require('dotenv').config();

// /

const userViews = require('./user-views');
const playlistViews = require('./playlist-views');
const songViews = require('./song-views');
const folderViews = require('./folder-views');

router.use('/', userViews);
router.use('/', playlistViews);
router.use('/', songViews);
router.use('/', folderViews);

router.get('/', (req, res) => {
    const {loggedIn} = req.session;

    if (loggedIn) {
        const formattedUrl = req.protocol + '://' + req.get('host');

        res.redirect(formattedUrl + '/playlists');
    } else {
        res.render('homepage', {loggedIn});
    }
});

router.get('/contact-and-support', (req, res) => {
    const {loggedIn} = req.session;

    res.render('contact-support', {loggedIn});
});

module.exports = router;