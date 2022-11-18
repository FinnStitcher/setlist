const {Schema, model} = require('mongoose');

const PlaylistSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        dateCreated: {
            type: Date,
            default: Date.now
            // install luxon and make a dateFormat util
        },
        dateLastModified: {
            type: Date,
            default: Date.now
            // install luxon and make a dateFormat util
        },
        songs: [{
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }],
        username: {
            type: String,
            ref: 'User',
            required: true
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

// virtual - playlist length
PlaylistSchema.virtual('playlistLength').get(function() {
    return this.songs.length;
});

const Playlist = model('Playlist', PlaylistSchema);

module.exports = Playlist;