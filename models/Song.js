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
            required: true,
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
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
);

const Song = model('Song', SongSchema);

module.exports = Song;