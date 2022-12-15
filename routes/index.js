const router = require('express').Router();

const viewRoutes = require('./views');
const apiRoutes = require('./api');

router.use('/', viewRoutes);
router.use('/api', apiRoutes);

router.get('*', (req, res) => {
    const {loggedIn} = req.session;
    
    res.render('not-found', {loggedIn});
});

module.exports = router;