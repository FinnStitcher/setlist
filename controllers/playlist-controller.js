const { Playlist, User, Folder } = require('../models');
const { checkUserOwnership } = require('../utils/utils.js');

const playlistController = {
	async getAllPlaylists(req, res) {
		try {
			const playlistDbRes = await Playlist.find({});

			res.status(200).json(playlistDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getOnePlaylist(req, res) {
		const searchTerm = req.params.id;

        try {
            const playlistDbRes = await Playlist.findOne({
                _id: searchTerm
            })
                .populate({
                    path: 'songs',
                    select: '-__v'
                });

            if (!playlistDbRes) {
                res.status(404).json({ message: 'No playlist with that ID.' });
                return;
            }

            res.status(200).json(playlistDbRes);
        } catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async postPlaylist(req, res) {
		const { title, dateCreated, dateLastModified, songs } = req.body;
		const { user_id, username } = req.session;

		// confirm user is logged in
		if (!user_id) {
			res.status(401).json({
				message: 'You need to be logged in to do that.'
			});
			return;
		}

		try {
			const playlistDbRes = await Playlist.create({
				title,
				dateCreated,
				dateLastModified,
				songs,
				username
			});

			const { _id } = playlistDbRes;

			// update relevant user profile
			const userDbRes = await User.findOneAndUpdate(
				{ _id: user_id },
				{ $push: { playlists: _id } },
				{ new: true }
			).populate({
                path: 'playlists',
                select: 'title'
            });

            // add to relevant user's Unsorted folder
            const folderDbRes = await Folder.findOneAndUpdate(
                { _id: userDbRes.folders[0] },
                { $push: { playlists: _id } },
                { new: true }
            ).populate({
                path: 'playlists',
                select: 'title'
            });

			res.status(200).json({
                user: userDbRes,
                folder: folderDbRes
            });
		} catch (err) {
			console.log(err);

			if (err.name === 'ValidatorError') {
				res.status(400).json({
					err,
					message: 'A title is required.'
				});
				return;
			}

			// generic error
			res.status(500).json(err);
		}
	},

	async editPlaylist(req, res) {
		const playlistId = req.params.id;
		const { title, dateLastModified, songs } = req.body;
		const { loggedIn, user_id } = req.session;

		// check that user is logged in
		if (!loggedIn) {
			res.status(401).json({
				message: 'You need to be logged in to do this.'
			});
			return;
		}

		// check that user owns this playlist
		const belongsToThisUser = await checkUserOwnership(
			loggedIn,
			user_id,
			playlistId
		);

		if (!belongsToThisUser) {
			res.status(403).json({
				message: "You can't edit someone else's playlist."
			});
			return;
		}

		// attempt to update
		try {
			const playlistDbRes = await Playlist.findOneAndUpdate(
				{ _id: playlistId },
				{
					title: title,
					dateLastModified: dateLastModified,
					songs: [...songs]
				},
				{ new: true }
			);

			if (!playlistDbRes) {
				res.status(404).json({ message: 'No playlist with that ID.' });
				return;
			}

			res.status(200).json(playlistDbRes);
		} catch (err) {
			console.log(err);

			if (err.name === 'ValidatorError') {
				res.status(400).json({
					err,
					message: 'A title is required.'
				});
				return;
			}

			// generic error
			res.status(500).json(err);
		}
	},

	async deletePlaylist(req, res) {
		const playlistId = req.params.id;
		const { loggedIn, user_id } = req.session;

		// check that user is logged in
		if (!loggedIn) {
			res.status(401).json({
				message: 'You need to be logged in to do this.'
			});
			return;
		}

		// check that user owns this playlist
		const belongsToThisUser = await checkUserOwnership(
			loggedIn,
			user_id,
			playlistId
		);

		if (!belongsToThisUser) {
			res.status(403).json({
				messages: "You can't delete someone else's playlist."
			});
			return;
		}

		// attempt to delete
		try {
			// delete playlist
			const playlistDbRes = await Playlist.findOneAndDelete({
				_id: playlistId
			});

			if (!playlistDbRes) {
				res.status(404).json({ message: 'No playlist with that ID.' });
				return;
			}

			const { username } = playlistDbRes;

			// remove playlist from relevant user's profile
			const userDbRes = await User.findOneAndUpdate(
				{ username: username },
				{ $pull: { playlists: playlistId } },
				{ new: true }
			).populate('playlists');

			res.status(200).json(userDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}
};

module.exports = playlistController;
