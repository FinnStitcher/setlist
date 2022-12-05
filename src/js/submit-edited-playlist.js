const formEl = document.getElementById('playlist-form');
const titleInputEl = document.getElementById('playlist-name');
const selectedSongEls = document.querySelectorAll('#selected-songs li');

// will store ids of songs
// needs to be declared out here to avoid scoping issue with selectedSongEls
const selectedIds = [];

const urlArray = window.location.toString().split('/');
const playlistId = urlArray[urlArray.length - 1];
console.log(playlistId);

async function formSubmitHandler(event) {
	event.preventDefault();

	selectedSongEls.forEach(element => {
		const id = element.getAttribute('data-id');
		selectedIds.push(id);
	});

	// create playlist object
	const playlistObj = {
		title: titleInputEl.value,
		dateLastModified: Date.now(),
		songs: [...selectedSongIds]
	};

	// send fetch req to server
	const response = await fetch('/api/playlists/' + playlistId, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(playlistObj)
	});
    
    if (response.ok) {
        // TODO: confirm submit and redirect
        window.location.assign('/playlists');
    }
}

formEl.addEventListener('submit', formSubmitHandler);
