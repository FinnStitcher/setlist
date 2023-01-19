const {Playlist, User, Song} = require('../models');
const {checkUserOwnership} = require('../utils/utils.js');

const playlistController = {
    getAllPlaylists(req, res) {
        Playlist.find({})
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getOnePlaylist(req, res) {
        const searchTerm = req.params.id;

        Playlist.findOne({
            _id: searchTerm
        })
        .populate({
            path: 'songs',
            select: '-__v'
        })
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        })
    },

    async postPlaylist(req, res) {
        const {title, dateCreated, dateLastModified, songs} = req.body;
        const {user_id, username} = req.session;

        // confirm user is logged-in
        if (!user_id) {
            res.status(401).json({message: 'You need to be logged in to do this.'});
            return;
        }

        try {
            const playlistDbRes = await Playlist.create({
                title,
                dateCreated,
                dateLastModified,
                songs,
                username
            });

            const {_id} = playlistDbRes;

            // update relevant user profile
            const userDbRes = await User.findOneAndUpdate(
                {_id: user_id},
                {$push: {playlists: _id}},
                {new: true}
            )
            .populate('playlists');

            res.status(200).json(userDbRes);
        } catch (err) {
            // catch errors
            console.log(err);

            if (err.name === 'ValidatorError') {
                res.status(400).json({
                    err,
                    message: 'A title is required.'
                });
                return;
            }

            // generic error
            res.status(500).json(err);
        }
    },

    async editPlaylist(req, res) {
        const playlistId = req.params.id;
        const {title, dateLastModified, songs} = req.body;
        const {loggedIn, user_id} = req.session;

        // check that user is logged in
        if (!loggedIn) {
            res.status(401).json({message: 'You need to be logged in to do this.'});
            return;
        }

        // check that user owns this playlist
        const belongsToThisUser = await checkUserOwnership(loggedIn, user_id, playlistId);

        if (!belongsToThisUser) {
            res.status(403).json({messages: 'You can\'t edit someone else\'s playlist.'});
            return;
        }

        Playlist.findOneAndUpdate(
            {_id: playlistId},
            {
                title: title,
                dateLastModified: dateLastModified,
                songs: songs
            },
            {new: true}

        )
        .then(dbRes => {
            // check that a playlist was found
            if (!dbRes) {
                res.status(404).json({message: 'No playlist with that ID.'});
                return;
            }

            res.json(dbRes);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    async deletePlaylist(req, res) {
        const playlistId = req.params.id;
        const {loggedIn, user_id} = req.session;

        // check that user is logged in
        if (!loggedIn) {
            res.status(401).json({message: 'You need to be logged in to do this.'});
            return;
        }

        // // check that user owns this playlist
        const belongsToThisUser = await checkUserOwnership(loggedIn, user_id, playlistId);

        if (!belongsToThisUser) {
            res.status(403).json({messages: 'You can\'t delete someone else\'s playlist.'});
            return;
        }

        Playlist.findOneAndDelete(
            {_id: playlistId}
        )
        .then(dbRes => {
            // check that a playlist was found
            if (!dbRes) {
                res.status(404).json({message: 'No playlist with that ID.'});
                return;
            }

            // destructure out relevant data
            const {_id, username} = dbRes;

            return User.findOneAndUpdate(
                {username: username},
                {$pull: {playlists: _id}},
                {new: true}
            );
        })
        .then(dbRes => {
            if (!dbRes) {
                res.status(400).json({message: 'Playlist deleted, but user could not be found.'});
                return;
            }

            res.json(dbRes);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    }
};

module.exports = playlistController;