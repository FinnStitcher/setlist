router = require('express').Router();
const {User, Folder} = require('../../models');
const {checkUserOwndership} = require('../../utils/utils.js');

router.get('/manage-folders', async (req, res) => {
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

module.exports = router;