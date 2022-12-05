const router = require('express').Router();
const {User, Playlist, Song} = require('../models');

router.get('/playlists', async (req, res) => {
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

    res.render('view-playlists', {userData});
});

router.get('/playlists/new', async (req, res) => {
    const songData = await Song.find()
    .lean()
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('create-playlist', {songData});
});

router.get('/playlists/edit/:id', async (req, res) => {
    // get info for this playlist
    const playlistData = await Playlist.findOne({_id: req.params.id})
    .lean()
    .select('-__v -username')
    .populate({
        path: 'songs'
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('edit-playlist', {playlistData});
});

router.get('/songs', (req, res) => {
    res.render('create-song');
});

module.exports = router;