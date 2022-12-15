const router = require('express').Router();
const {Playlist, User, Song} = require('../../models');

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

    res.render('view-playlists', {userData, belongsToThisUser: true, loggedIn});
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

    // usernames are unique, so this works ok
    // may instate a more elegant methodology later
    const playlistOwnerData = await User.findOne({
        username: playlistData.username
    })
    .lean()
    .select('_id username')
    .then(dbRes => dbRes)
    .catch(err => err);

    // if loggedIn, locate this user in the db
    // check if this playlist's id is in their playlists array
    const {_id} = playlistData;

    let belongsToThisUser = false;
    
    if (loggedIn) {
        const userData = await User.findOne({
            _id: user_id
        })
        .lean()
        .then(dbRes => dbRes)
        .catch(err => err);

        // ids are stored as instances of ObjectID, so we can't just use indexOf
        userData.playlists.forEach(element => {
            if (element.toString() === _id.toString()) {
                belongsToThisUser = true;
                return;
            }
        });
    }

    res.render('single-playlist', {playlistData, playlistOwnerData, belongsToThisUser, loggedIn});
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

module.exports = router;