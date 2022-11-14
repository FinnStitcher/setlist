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