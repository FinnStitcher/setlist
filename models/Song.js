const {Schema, model} = require('mongoose');

const SongSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        artist: {
            type: String,
            trim: true,
            default: 'Unknwon Artist'
        },
        album: {
            type: String,
            trim: true
        },
        year: {
            type: Number,
            trim: true
        }
    }
);

const Song = model('Song', SongSchema);

module.exports = Song;