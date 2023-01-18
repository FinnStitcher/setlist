const router = require('express').Router();
const {User} = require('../../models');

router.get('/users/:id', async (req, res) => {
    const {loggedIn} = req.session;
    const {id: userId} = req.params;

    // using .lean() so data can be fed into handlebars
    try {
        const userData = await User.findOne({
            _id: userId
        })
        .lean()
        .select('-password -__v')
        .populate({
            path: 'playlists',
            select: '-__v -username',
            populate: {path: 'songs'}
        });

        // check if this user is viewing their own profile
        let belongsToThisUser = loggedIn && userData._id.toString() === userId;

        res.render('user', {userData, belongsToThisUser, loggedIn});
    } catch (err) {
        res.status(404);

        const errorMessage = 'User not found.';
        res.render('error', {errorMessage, loggedIn});
    }

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