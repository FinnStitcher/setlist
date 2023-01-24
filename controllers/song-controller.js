const {Song} = require('../models');

const songController = {
    async getAllSongs(req, res) {
        try {
            const songDbRes = await Song.find({});

            res.status(200).json(songDbRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    
    async getOneSong(req, res) {
        const searchTerm = req.params.id;

        try {
            const songDbRes = await Song.findOne({
                _id: searchTerm
            });

            if (!songDbRes) {
                res.status(404).json({ message: 'No song with that ID.' });
                return;
            }

            res.status(200).jsoN(songDbRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async searchSongs(req, res) {
        // used on create-playlist and edit-playlist pages

        const searchTerm = req.params.search;
        // convert searchTerm into a regexp
        // requires a word boundary at the start of the search term
        const searchRegex = new RegExp('\\b' + searchTerm, 'i');
        
        try {
            const songDbRes = await Song.find({
                title: searchRegex
            });

            if (!songDbRes) {
                // status 204 because the search turning up nothing is an expected and acceptable result
                // frontend will tell the user there was nothing
                res.status(204);
                return;
            }

            res.status(200).json(songDbRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async matchSongs(req, res) {
        // runs on the submit a song page
        // returns songs that the user might be typing in a duplicate of

        // turn query params into regexps
        const titleRegex = req.query.title ? new RegExp('\\b' + req.query.title, 'i') : new RegExp('.');
        const artistRegex = req.query.artist ? new RegExp('\\b' + req.query.artist, 'i') : new RegExp('.');

        try {
            const songDbRes = await Song.find({
                $and: [
                    {title: titleRegex},
                    {artist: artistRegex}
                ]
            });

            if (!songDbRes) {
                // see rationale in searchSongs()
                res.status(204);
                return;
            }

            res.status(200).json(songDbRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async postSong(req, res) {
        const {title, artist, album, year} = req.body;

        try {
            const songDbRes = await Song.create({
                title,
                artist,
                album,
                year
            });

            res.status(200).json(songDbRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};

module.exports = songController;