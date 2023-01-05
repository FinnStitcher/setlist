const {Playlist, User, Song} = require('../models');
const {checkUserOwnership} = require('../utils/utils.js');

const playlistController = {
    getAllPlaylists(req, res) {
        console.log('getAllPlaylists');

        Playlist.find({})
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getOnePlaylist(req, res) {
        console.log('getOnePlaylist');

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
        console.log('postPlaylist');

        const {body} = req;
        const {user_id, username} = req.session;

        // add username to playlist document
        body.username = username;

        // confirm user is logged-in
        if (!user_id) {
            res.status(401).json({message: 'You need to be logged in to do this.'});
            return;
        }

        Playlist.create(body)
        .then(dbRes => {
            // destructure out playlist id
            const {_id} = dbRes;

            // update relevant user profile
            return User.findOneAndUpdate(
                {_id: user_id},
                {$push: {playlists: _id}},
                {new: true}
            )
            .populate('playlists');
        })
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    async editPlaylist(req, res) {
        console.log('editPlaylist');

        const playlistId = req.params.id;
        const {title, dateLastModified, songs} = req.body;
        const {loggedIn, user_id} = req.session;

        // check that user is logged in
        if (!loggedIn) {
            res.status(401).json({message: 'You need to be logged in to do this.'});
            return;
        }

        // check that user owns this playlist
        // const belongsToThisUser = await User.findOne({
        //     _id: user_id
        // })
        // .then(dbRes => {
        //     // check if this pl is in the user's playlist array
        //     return dbRes.playlists.indexOf(playlistId) !== -1;
        // });

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
        console.log('deletePlaylist');

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