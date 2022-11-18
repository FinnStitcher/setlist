const {Playlist, User} = require('../models');

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
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        })
    },

    async postPlaylist(req, res) {
        console.log('postPlaylist');

        const {body} = req;

        // temp verification
        // check that user exists
        // will replace this when sessions are set up
        const userExists = await User.findOne({
            username: body.username
        });

        if (!userExists) {
            res.status(400).json({message: 'User not found.'});
        }

        Playlist.create(body)
        .then(dbRes => {
            // destructure out username and playlist id
            const {_id, username} = dbRes;

            return User.findOneAndUpdate(
                {username: username},
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

    async deletePlaylist(req, res) {
        console.log('deletePlaylist');

        const searchTerm = req.params.id;

        Playlist.findOneAndDelete(
            {_id: searchTerm}
        )
        .then(dbRes => {
            // check that a playlist was found
            if (!dbRes) {
                res.status(404).json({message: 'No playlist with that ID.'});
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