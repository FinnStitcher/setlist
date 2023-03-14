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

    if (thisUserData.playlists.includes(playlistId)) {
        return true;
    } else {
        return false;
    }
};

async function checkFolderOwnership(loggedIn, userId, folderId) {
    if (!loggedIn) {
        return false;
    }

    const thisUserData = await User.findOne({
        _id: userId
    })
    .then(dbRes => dbRes)
    .catch(err => err);

    if (thisUserData.folders.includes(folderId)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    checkUserOwnership,
    checkFolderOwnership
};