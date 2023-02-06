const emailjs = require('@emailjs/nodejs');
require('dotenv').config();

const emailController = {
    async sendEmail(req, res) {
        const emailObj = {
            'email-name': req.body.name,
            'email-address': req.body.address,
            'email-subject': req.body.subject,
            'email-message': req.body.message
        }
        
        try {
            const emailRes = await emailjs.send(
                'service_setlist', // service id
                'template_setlist', // template id
                emailObj,
                {
                    publicKey: process.env.EMAILJS_PUBLIC_KEY,
                    privateKey: process.env.EMAILJS_PRIVATE_KEY
                }
            );
            res.status(200).json(emailRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};

module.exports = emailController;