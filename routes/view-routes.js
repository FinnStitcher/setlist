const router = require('express').Router();
const {User, Playlist, Song} = require('../models');

router.get('/', async (req, res) => {
    const {loggedIn} = req.session;

    if (loggedIn) {
        window.location.assign('/playlists');
    } else {
        res.render('homepage', {loggedIn});
    }
})

router.get('/playlists', async (req, res) => {
    const {loggedIn} = req.session;

    // get this user's data, incl playlists
    // we'll get the user's id from the session, later
    // right now i'm leaving it randomized
    // using .lean() so data can be fed into handlebars
    const userData = await User.findOne()
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

router.get('/playlists/new', async (req, res) => {
    const {loggedIn} = req.session;

    const songData = await Song.find()
    .lean()
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('create-playlist', {songData, loggedIn});
});

router.get('/playlists/edit/:id', async (req, res) => {
    const {loggedIn} = req.session;

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

router.get('/songs', (req, res) => {
    const {loggedIn} = req.session;

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