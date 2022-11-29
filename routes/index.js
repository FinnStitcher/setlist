const router = require('express').Router();

const viewRoutes = require('./view-routes');
const apiRoutes = require('./api');

router.use('/', viewRoutes);
router.use('/api', apiRoutes);

module.exports = router;