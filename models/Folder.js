const {Schema, model} = require('mongoose');

const FolderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        dateLastModified: {
            type: Date,
            default: Date.now
            // install luxon and make a dateFormat util
        },
        playlists: [{
            type: Schema.Types.ObjectId,
            ref: 'Playlist'
        }],
        username: {
            type: String,
            ref: 'User',
            required: true
        }
    }
);

const Folder = model('Folder', FolderSchema);

module.exports = Folder;