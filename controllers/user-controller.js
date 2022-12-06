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
        .populate({
            path: 'playlists',
            select: '-__v -username'
        })
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
        .then(dbRes => {
            req.session.save(() => {
                req.session.user_id = dbRes._id;
                req.session.username = dbRes.username;
                req.session.loggedIn = true;

                res.status(201).json({
                    user: dbRes,
                    message: 'You\'re logged in.'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    loginUser(req, res) {
        console.log('loginUser');

        const {username, password} = req.body;
        
        // check if user actually exists
        User.findOne({
            username: username
        })
        .then(async dbRes => {
            // user does not exist
            if (!dbRes) {
                res.status(404).json({message: 'No user with that username.'});
                return;
            }
            
            // user does exist
            // check if password is valid
            const isPassValid = await dbRes.comparePassword(password);

            if (!isPassValid) {
                res.status(403).json({message: 'Password is incorrect.'});
                return;
            }

            // add user data to the session
            req.session.save(() => {
                req.session.user_id = dbRes._id.toString();
                req.session.username = dbRes.username;
                req.session.loggedIn = true;

                console.log(req.session);

                res.status(200).json({
                    user: dbRes,
                    message: 'You\'re logged in.'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    logoutUser(req, res) {
        console.log('logoutUser');

        // if logged in, destroy session
        if (req.session.loggedIn) {
            req.session.destroy(() => {
                res.status(204).end();
            })
            return;
        }

        // unauthorized
        res.status(401).end();
    },

    deleteUser(req, res) {
        console.log('deleteUser');

        const {id} = req.params;

        User.findOneAndDelete(
            {_id: id}
        )
        .then(dbRes => {
            // user was not found
            if (!dbRes) {
                res.status(404).json({message: 'No user with that ID.'});
                return;
            }

            // TODO: Delete all playlists associated w this user

            // user was found
            const {username} = dbRes;
            res.json({message: `User ${username} was deleted successfully.`});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    }
};

module.exports = userController;