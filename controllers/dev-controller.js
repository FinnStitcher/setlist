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
        console.log('devEditUser');

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
        console.log('devEditPlaylist');
        
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
    }
};

module.exports = devController;