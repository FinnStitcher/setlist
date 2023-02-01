const { Song } = require('../models');

const songController = {
	async getAllSongs(req, res) {
		try {
			const songDbRes = await Song.find({});

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getOneSong(req, res) {
		const searchTerm = req.params.id;

		try {
			const songDbRes = await Song.findOne({
				_id: searchTerm
			});

			if (!songDbRes) {
				res.status(404).json({ message: 'No song with that ID.' });
				return;
			}

			res.status(200).jsoN(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async getSongsByUser(req, res) {
		// making this route accept an id in the body for dev purposes
		const { user_id } = req.session || req.body;
		const { search } = req.query;

		if (!user_id) {
			res.status(400).json({
				message: 'Missing an ID to search with.'
			});
			return;
		}

		// convert search into regex
		const searchRegex = search
			? new RegExp('\\b' + search, 'i')
			: new RegExp('.');

		try {
			const songDbRes = await Song.find({
				uploadedBy: user_id,
				$or: [{ title: searchRegex }, { artist: searchRegex }]
			});

			if (!songDbRes) {
				// a search turning up nothing is an acceptable result
				res.status(200).json({ message: 'No results.' });
				return;
			}

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async searchSongs(req, res) {
		// used on create-playlist and edit-playlist pages

		const searchTerm = req.params.search;
		// convert searchTerm into a regexp
		// requires a word boundary at the start of the search term
		const searchRegex = new RegExp('\\b' + searchTerm, 'i');

		try {
			const songDbRes = await Song.find({
				title: searchRegex
			});

			if (!songDbRes) {
				// status 200 because the search turning up nothing is an expected and acceptable result
				// frontend will tell the user there was nothing
				res.status(200);
				return;
			}

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async matchSongs(req, res) {
		// runs on the submit a song page
		// returns songs that the user might be typing in a duplicate of

		// turn query params into regexps
		const titleRegex = req.query.title
			? new RegExp('\\b' + req.query.title, 'i')
			: new RegExp('.');
		const artistRegex = req.query.artist
			? new RegExp('\\b' + req.query.artist, 'i')
			: new RegExp('.');

		try {
			const songDbRes = await Song.find({
				$and: [{ title: titleRegex }, { artist: artistRegex }]
			});

			if (!songDbRes) {
				// see rationale in searchSongs()
				res.status(204);
				return;
			}

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async postSong(req, res) {
		const { title, artist, album, year } = req.body;
		const { user_id } = req.session;

		// confirm user is logged in
		if (!user_id) {
			res.status(401).json({
				message: 'You need to be logged in to do that.'
			});
			return;
		}

		try {
			const songDbRes = await Song.create({
				title,
				artist,
				album,
				year,
				uploadedBy: user_id
			});

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	async putSong(req, res) {
		const { title, artist, album, year } = req.body;
		const { id: songId } = req.params;
		const { user_id } = req.session;

		// confirm user is logged in
		if (!user_id) {
			res.status(401).json({
				message: 'You need to be logged in to do that.'
			});
			return;
		}

		try {
			const songDbRes = await Song.findOneAndUpdate(
				{
					_id: songId
				},
				{
					title: title,
					artist: artist,
					album: album,
					year: year
				},
				{ new: true }
			);

			res.status(200).json(songDbRes);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}
};

module.exports = songController;
