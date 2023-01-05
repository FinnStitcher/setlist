const {User} = require('../models');

async function checkUserOwnership(loggedIn, userId, playlistId) {
    console.log('checkUserOwnership');
    
    if (!loggedIn) {
        return false;
    }

    const thisUserData = await User.findOne({
        _id: userId
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    if (thisUserData.playlists.indexOf(playlistId) !== -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    checkUserOwnership
};