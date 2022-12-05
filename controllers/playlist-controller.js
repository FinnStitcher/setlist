const {Playlist, User, Song} = require('../models');

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

    async editPlaylist(req, res) {
        console.log('editPlaylist');

        const searchTerm = req.params.id;
        const {title, dateLastModified, songs} = req.body;

        Playlist.findOneAndUpdate(
            {_id: searchTerm},
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
        })
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
    },

    async addSongToPlaylist(req, res) {
        console.log('addSongToPlaylist');

        // destructure out values
        const playlistId = req.params.id;
        const {songId} = req.body;

        // check that songId is valid
        const songExists = await Song.findOne({
            _id: songId
        });

        if (!songExists) {
            res.status(400).json({message: 'No song with this ID.'});
            return;
        }

        // works with single elements or arrays
        Playlist.findOneAndUpdate(
            {_id: playlistId},
            {$addToSet: {songs: songId}},
            {new: true}
        )
        .then(dbRes => {
            if (!dbRes) {
                res.status(404).json({message: 'Playlist not found.'});
                return;
            }

            // update dateLastModified
            return Playlist.findOneAndUpdate(
                {_id: playlistId},
                {dateLastModified: Date.now()},
                {new: true}
            );
        })
        .then(dbRes => {
            if (!dbRes) {
                res.status(500).json({message: 'Something went wrong.'});
                return;
            }

            res.json(dbRes);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    async removeSongFromPlaylist(req, res) {
        console.log('removeSongFromPlaylist');

        // destructure out values
        const playlistId = req.params.id;
        const {songId} = req.body;

        // works with single elements or arrays
        Playlist.findOneAndUpdate(
			{ _id: playlistId },
			{ $pull: { songs: { $in: songId } } },
			{ new: true }
		)
        .then(dbRes => {
            if (!dbRes) {
                res.status(404).json({ message: 'Playlist not found.' });
                return;
            }

            // update dateLastModified
            return Playlist.findOneAndUpdate(
                {_id: playlistId},
                {dateLastModified: Date.now()},
                {new: true}
            );
        })
        .then(dbRes => {
            if (!dbRes) {
                res.status(500).json({message: 'Something went wrong.'});
                return;
            }

            res.json(dbRes);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
};

module.exports = playlistController;