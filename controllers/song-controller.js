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

    postSong(req, res) {
        console.log('postSong');

        const {body} = req;

        Song.create(body)
        .then(dbRes => res.json(dbRes))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
};

module.exports = songController;