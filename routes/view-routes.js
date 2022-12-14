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
        _id: user_id
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

router.get('/playlists/:id', async (req, res) => {
    const {loggedIn, user_id} = req.session;
    const {id: playlistId} = req.params;

    // using .lean() so data can be fed into handlebars
    const playlistData = await Playlist.findOne({
        _id: playlistId
    })
    .lean()
    .populate('songs')
    .then(dbRes => dbRes)
    .catch(err => err);

    // if loggedIn, locate this user in the db
    // check if this playlist's id is in their playlists array
    // const {_id} = playlistData;

    // let belongsToThisUser = false;
    
    // if (loggedIn) {
    //     const userData = User.findOne({
    //         _id: user_id
    //     })
    //     .lean()
    //     .then(dbRes => dbRes)
    //     .catch(err => err);

    //     // if this playlist is present in userData.playlists, this will be true
    //     console.log(userData);
    //     // belongsToThisUser = userData.playlists.indexOf(_id) !== -1;
    // }

    res.render('single-playlist', {playlistData, loggedIn});
})

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
    const playlistData = await Playlist.findOne({
        _id: req.params.id
    })
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

router.get('*', (req, res) => {
    const {loggedIn} = req.session;
    
    res.render('not-found', {loggedIn});
});

module.exports = router;