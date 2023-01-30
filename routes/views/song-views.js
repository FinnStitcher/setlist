const router = require('express').Router();

router.get('/add-song', (req, res) => {
    const {loggedIn} = req.session;

    if (!loggedIn) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    res.render('create-song', {loggedIn});
});

router.get('/edit-song', (req, res) => {
    const {loggedIn} = req.session;

    if (!loggedIn) {
        res.render('auth-failed', {loggedIn});
        return;
    }

    res.render('edit-song', {loggedIn});
})

module.exports = router;