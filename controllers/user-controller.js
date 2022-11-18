const {User} = require('../models');

const userController = {
    getAllUsers(req, res) {
        console.log('getAllUsers');

        User.find({})
        .select('-__v')
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getOneUser(req, res) {
        console.log('getOneUser');

        const searchTerm = req.params.id;

        User.findOne({
            _id: searchTerm
        })
        .populate('playlists')
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        });
    },

    postUser(req, res) {
        console.log('postUser');

        const {body} = req;

        User.create(body)
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

        // no login/logout right now
        // will automatically login user on user creation
    }
};

module.exports = userController;