const {Playlist, User} = require('../models');
require('dotenv').config();

// these functions ignore ownership, but you need to provide a valid access key in the headers

function checkDevAuth(key) {
    // key parameter is the value of req.headers.authorization

    if (key === process.env.API_KEY) {
        return true;
    } else {
        return false;
    }
};

const devController = {
    // make any edit to a user
    devEditUser(req, res) {
        const {authorization} = req.headers;
        const isDev = checkDevAuth(authorization);
        
        if (!isDev) {
            res.status(403).json({message: 'You are not authorized to use this endpoint.'});
            return;
        }

        const userId = req.params.id;
        const {body} = req;

        User.findOneAndUpdate(
            {_id: userId},
            {...body},
            {new: true}
        )
        .then(dbRes => {
            // check that a user was found
            if (!dbRes) {
                res.status(404).json({message: 'No user with that ID.'});
                return;
            }

            res.json(dbRes);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // make any edit to a playlist
    devEditPlaylist(req, res) {
        const {authorization} = req.headers;
        const isDev = checkDevAuth(authorization);
        
        if (!isDev) {
            res.status(403).json({message: 'You are not authorized to use this endpoint.'});
            return;
        }

        const playlistId = req.params.id;
        const {body} = req;

        Playlist.findOneAndUpdate(
            {_id: playlistId},
            {...body},
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

    devDeleteUser(req, res) {
        const {authorization} = req.headers;
        const isDev = checkDevAuth(authorization);
        
        if (!isDev) {
            res.status(403).json({message: 'You are not authorized to use this endpoint.'});
            return;
        }

        const userId = req.params.id;

        User.findOneAndDelete(
            {_id: userId}
        )
        .then(async dbRes => {
            // user was not found
            if (!dbRes) {
                res.status(404).json({message: 'No user with that ID.'});
                return;
            }

            console.log(dbRes);

            // user was found
            // delete playlists belonging to this user
            const {username, playlists} = dbRes;

            const playlistDelRes = await Playlist.deleteMany(
                {_id: {
                    $in: [...playlists]
                }}
            );

            return {username, playlistDelRes}
        })
        .then(data => {
            if (!data.playlistDelRes) {
                res.status(500).json({message: 'User was deleted, but there was an error deleting playlists.'})
            return;
            }

            res.json({message: `User ${data.username} has been deleted.`});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    devDeletePlaylist(req, res) {
        const {authorization} = req.headers;
        const isDev = checkDevAuth(authorization);
        
        if (!isDev) {
            res.status(403).json({message: 'You are not authorized to use this endpoint.'});
            return;
        }

        const playlistId = req.params.id;

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

module.exports = devController;