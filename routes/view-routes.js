const router = require('express').Router();
const {User} = require('../models');

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

    res.render('view-playlists', {data: userData});
});

module.exports = router;