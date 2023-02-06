const router = require('express').Router();

// /api/email

const { sendEmail } = require('../../controllers/email-controller');

router.route('/').post(sendEmail);

module.exports = router;