const { Folder, User } = require('../models');
const { checkUserOwnership } = require('../utils/utils.js');

const folderController = {
    async getAllFolders(req, res) {
        try {
            const folderDbRes = await Folder.find({});

            res.status(200).json(folderDbRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getOneFolder(req, res) {
        const searchTerm = req.params.id;

        try {
            const folderDbRes = await Folder.findOne({
                _id: searchTerm
            })
            .populate({
                path: 'playlists',
                select: '-__v'
            });

            if (!folderDbRes) {
                res.status(404).json({ message: 'No folder with that ID.' });
                return;
            }

            res.status(200).json(folderDbRes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async postFolder(req, res) {
        const { name, dateLastModified, playlists } = req.body;
        const { user_id, username } = req.session;

        // confirm user is logged in
        if (!user_id) {
            res.status(401).json({
                message: 'You need to be logged in to do that.'
            });
            return;
        }

        try {
            const folderDbRes = await Folder.create({
                name,
                dateLastModified,
                playlists,
                username
            });

            const { _id } = folderDbRes;

            // update relevant user profile
            const userDbRes = await User.findOneAndUpdate(
                { _id: user_id },
                { $push: { folders: _id }},
                { new: true }
            ).populate('folders');

            res.status(200).json(userDbRes);
        } catch (err) {
            console.log(err);

			if (err.name === 'ValidatorError') {
				res.status(400).json({
					err,
					message: 'A name is required.'
				});
				return;
			}

			// generic error
			res.status(500).json(err);
        }
    },

    async editFolder(req, res) {
        const folderId = req.params.id;
        const { name, dateLastModified, playlists } = req.body;
        const { loggedIn, user_id } = req.session;

        // check that user is logged in
        if (!loggedIn) {
			res.status(401).json({
				message: 'You need to be logged in to do this.'
			});
			return;
        }

        // check that user owns this folder
        const belongsToThisUser = await checkUserOwnership(
            loggedIn,
            user_id,
            folderId
        );

        if (!belongsToThisUser) {
            res.status(401).json({
                message: "You can't edit someone else's playlist."
            });
            return;
        }

        // attempt to update
        try {
            const folderDbRes = await Folder.findOneAndUpdate(
                { _id: folderId },
                {
                    name: name,
                    dateLastModified: dateLastModified,
                    playlists: [...playlists]
                },
                { new: true }
            );

            if (!folderDbRes) {
                res.status(404).json({ message: 'No folder with that ID.' });
                return;
            }

            res.status(200).json(userDbRes);
        } catch (err) {
			console.log(err);

			if (err.name === 'ValidatorError') {
				res.status(400).json({
					err,
					message: 'A name is required.'
				});
				return;
			}

			// generic error
			res.status(500).json(err);
        }
    },

    async deleteFolder(req, res) {
        const folderId = req.params.id;
        const { loggedIn, user_id } = req.session;

        // check that user is logged in
        if (!loggedIn) {
			res.status(401).json({
				message: 'You need to be logged in to do this.'
			});
			return;
        }

        // check that user owns this folder
        const belongsToThisUser = await checkUserOwnership(
            loggedIn,
            user_id,
            folderId
        );

        if (!belongsToThisUser) {
            res.status(401).json({
                message: "You can't delete someone else's playlist."
            });
            return;
        }

        // attempt to delete
        try {
            const folderDbRes = await Folder.findOneAndDelete({
                _id: folderId
            });

            if (!folderDbRes) {
                res.status(404).json({ message: 'No folder with that ID.' });
                return;
            }

            // remove folder from relevant user's profile
            const userDbRes = await User.findOneAndUpdate(
                { _id: user_id },
                { $pull: { folders: folderId } },
                { new: true }
            ).populate('folders');

            res.status(200).json(userDbRes);
        } catch (err) {
			console.log(err);
			res.status(500).json(err);
        }
    }
};

module.exports = folderController;