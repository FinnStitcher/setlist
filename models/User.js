const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        playlists: [{
            type: Schema.Types.ObjectId,
            ref: 'Playlist'
        }]
    }
);

// declaring a hook that will run before a document is saved to the db
UserSchema.pre('save', function(next) {
    // runs if the password has been modified
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 4, (err, hash) => {
            if (err) {
                return next(err);
            }

            this.password = hash;
            next();
        })
    }
});
// i believe next() just tells the script to go on to the next middleware, if there is any

// method that will decrypt the password
// can call this method wherever it's needed
UserSchema.methods.comparePassword = async function(inputPassword) {
    if (!inputPassword) {
        throw new Error('No password provided.')
    }

    const isPassValid = await bcrypt.compare(inputPassword, this.password);
    
    return isPassValid;
};

const User = model('User', UserSchema);

module.exports = User;