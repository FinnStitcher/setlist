const router = require('express').Router();
const {User, Playlist, Song} = require('../models');

router.get('/', async (req, res) => {
    const {loggedIn} = req.session;

    if (loggedIn) {
        window.location.assign('/playlists');
    } else {
        res.render('homepage', {loggedIn});
    }
});

router.get('/playlists', async (req, res) => {
    const {loggedIn, user_id} = req.session;

    if (!loggedIn) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    // get this user's data, incl playlists
    // using .lean() so data can be fed into handlebars
    const userData = await User.findOne({
        where: {
            _id: user_id
        }
    })
    .lean()
    .select('-password -__v')
    .populate({
        path: 'playlists',
        select: '-__v -username',
        populate: {path: 'songs'}
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('view-playlists', {userData, loggedIn});
});

router.get('/add-playlist', async (req, res) => {
    const {loggedIn} = req.session;

    if (!loggedIn) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    const songData = await Song.find()
    .lean()
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('create-playlist', {songData, loggedIn});
});

router.get('/edit-playlist/:id', async (req, res) => {
    const {loggedIn} = req.session;

    if (!loggedIn) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    // get info for this playlist
    const playlistData = await Playlist.findOne({_id: req.params.id})
    .lean()
    .select('-__v -username')
    .populate({
        path: 'songs'
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('edit-playlist', {playlistData, loggedIn});
});

router.get('/add-song', (req, res) => {
    const {loggedIn} = req.session;

    if (!loggedIn) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    res.render('create-song', {loggedIn});
});

router.get('/login', (req, res) => {
    const {loggedIn} = req.session;
    
    res.render('login', {loggedIn});
});

router.get('/signup', (req, res) => {
    const {loggedIn} = req.session;
    
    res.render('signup', {loggedIn});
});

module.exports = router;