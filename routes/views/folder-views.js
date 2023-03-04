router = require('express').Router();
const {User, Folder} = require('../../models');
const {checkUserOwndership} = require('../../utils/utils.js');

router.get('/folders', async (req, res) => {
    const {loggedIn, user_id} = req.session;

    if (!loggedIn) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    // get this user's folder data
    const userData = await User.findOne({
        _id: user_id
    })
    .lean()
    .select('folders')
    .populate({
        path: 'folders',
        populate: {
            path: 'playlists'
        }
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('manage-folders', {userData, belongsToThisUser: true, loggedIn});
});

router.get('/new-folder', async (req, res) => {
    const {loggedIn, user_id} = req.session;

    if (!user_id) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    // get this user's playlists
    const userData = await User.findOne({
        _id: user_id
    })
    .lean()
    .select('playlists')
    .populate('playlists')
    .then(dbRes => dbRes)
    .catch(err => err);

    res.render('create-folder', {loggedIn, userData});
});

module.exports = router;