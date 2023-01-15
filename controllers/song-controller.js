const {Song} = require('../models');

const songController = {
    getAllSongs(req, res) {
        console.log('getAllSongs');

        Song.find({})
        .select('-__v')
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    
    getOneSong(req, res) {
        console.log('getOneSong');

        const searchTerm = req.params.id;

        Song.findOne({
            _id: searchTerm
        })
        .select('-__v')
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        });
    },

    searchSongs(req, res) {
        console.log('searchSongs');

        const searchTerm = req.params.search;
        // convert searchTerm into a regexp
        // requires a word boundary at the start of the search term
        const searchRegex = new RegExp('\\b' + searchTerm, 'i');
        
        Song.find({
            title: searchRegex
        })
        .lean()
        .select('title artist _id')
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        });
    },

    matchSongs(req, res) {
        console.log('matchSongs');

        // runs on the submit a song page
        // returns songs that the user might be typing in a duplicate of

        // turn query params into regexps
        const titleRegex = req.query.title ? new RegExp('\\b' + req.query.title, 'i') : new RegExp('.');
        const artistRegex = req.query.artist ? new RegExp('\\b' + req.query.artist, 'i') : new RegExp('.');

        Song.find({
            $and: [
                {title: titleRegex},
                {artist: artistRegex}
            ]
        })
        .lean()
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        });
    },

    exactMatchSong(req, res) {
        console.log('exactMatchSong');

        // looks for exact matches of title/artist combination

        // destructure out query params
        const {title, artist} = req.query;

        // search
        Song.findOne({
            $and: [
                {title: title},
                {artist: artist}
            ]
        })
        .lean()
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        });
    },

    postSong(req, res) {
        console.log('postSong');

        const {title, artist, album, year} = req.body;

        if (!title || !artist) {
            res.status(400).json({message: 'Missing required info.'});
            return;
        }

        Song.create({
            title,
            artist,
            album: album? album : null,
            year: year? year : null
        })
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
};

module.exports = songController;