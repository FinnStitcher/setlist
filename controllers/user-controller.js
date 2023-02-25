const { User, Folder } = require('../models');

require('dotenv').config();

const userController = {
    async getAllUsers(req, res) {
        try {
            const dbRes = await User.find({}).select('-__v');
            res.status(200).json(dbRes);
        } catch (err) {
            // catch server errors
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getOneUser(req, res) {
        const searchTerm = req.params.id;

        try {
            const dbRes = await User.findOne({
                _id: searchTerm
            })
            .populate({
                path: 'folders',
                select: '-__v -username',
                populate: {
                    path: 'playlists',
                    select: '-__v -username'
                }
            });

            // user was not found
            if (!dbRes) {
                res.status(404).json({message: 'User not found.'});
                return;
            }

            res.status(200).json(dbRes);
        } catch (err) {
            // catch server errors
            console.log(err);
            res.status(500).json(err);
        }
    },

    async postUser(req, res) {
        const {username, password} = req.body;

        try {
            // check if a user with this username already exists
            const userWithThisUsername = await User.findOne({
                username: username
            });

            if (userWithThisUsername) {
                res.status(403).json({message: 'This username is taken.'});
                return;
            }

            // create 'Unsorted' folder for this user
            const { _id: unsortedFolderId } = await Folder.create({
                name: 'Unsorted',
                username
            });

            const userDbRes = await User.create({
                username,
                password,
                folders: [unsortedFolderId]
            });

            // add user data to session
            req.session.save(() => {
                req.session.user_id = userDbRes._id;
                req.session.username = userDbRes.username;
                req.session.loggedIn = true;

                res.status(201).json({
                    user: userDbRes,
                    session: req.session,
                    message: 'You\'re logged in.'
                });
            });
        } catch (err) {
            // catch server errors
            console.log(err);
            res.status(500).json(err);
        }
    },

    async loginUser(req, res) {
        const {username, password} = req.body;

        try {
            // check if this user exists
            const dbRes = await User.findOne({
                username: username
            });

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

            // password was valid
            // add user data to session
            await req.session.save(() => {
                req.session.user_id = dbRes._id.toString();
                req.session.username = dbRes.username;
                req.session.loggedIn = true;

                res.status(200).json({
                    user: dbRes,
                    session: req.session,
                    message: 'You\'re logged in.'
                });
            });
        } catch (err) {
            // catch server errors
            console.log(err);
            res.status(500).json(err);
        }
    },

    logoutUser(req, res) {
        // if logged in, destroy session
        if (req.session.loggedIn) {
            req.session.destroy((err) => {
                if (err) {
                    throw err;
                }

                res.clearCookie(process.env.SESSION_NAME);
                res.status(204).end();
            });
            return;
        }

        // unauthorized
        res.status(401).end();
    }
};

module.exports = userController;