const formEl = document.getElementById('playlist-form');
const titleInputEl = document.getElementById('playlist-name');
const selectedSongEls = document.querySelectorAll('#selected-songs li');

// will store ids of songs
// needs to be declared out here to avoid scoping issue with selectedSongEls
const selectedIds = [];

async function formSubmitHandler(event) {
	event.preventDefault();

	selectedSongEls.forEach(element => {
		const id = element.getAttribute('data-id');
		selectedIds.push(id);
	});

	// create playlist object
	// temporarily hardcoding for my acct
	// later the username wll be added on the backend
	const playlistObj = {
		title: titleInputEl.value,
		dateCreated: Date.now,
		dateLastModified: Date.now,
		songs: [...selectedSongIds],
		username: '20firebird'
	};

	// send fetch req to server
	const response = await fetch('/api/playlists', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(playlistObj)
	}).then(dbRes => dbRes.json());

	console.log(response);
}

formEl.addEventListener('submit', formSubmitHandler);
