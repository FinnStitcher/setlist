const formEl = document.getElementById('playlist-form');
const titleInputEl = document.getElementById('playlist-name');

const playlistModal = document.getElementById('pl-modal');
const playlistModalCloseBtn = document.getElementById('pl-modal-close-btn');
const modalText = document.querySelector('#pl-modal p');

function displayModal(message) {
    modalText.textContent = message;
    playlistModal.showModal();
};

async function formSubmitHandler(event) {
	event.preventDefault();

    const title = titleInputEl.value;

    // check that title is present
    if (!title) {
        displayModal('A title is required.');
        return;
    }

    // extract ids of these lis
    // having this variable declared in global scope makes the list inaccessible in here
    // unsure why
    const selectedSongEls = document.querySelectorAll('#selected-songs li');
    const selectedSongIds = [];

    // go through list, extract ids, put them in selectedSongIds
	selectedSongEls.forEach(element => {
		const id = element.getAttribute('data-id');
		selectedSongIds.push(id);
	});

	// create playlist object
	const playlistObj = {
		title: title,
		dateLastModified: Date.now(),
		songs: [...selectedSongIds]
	};

    // get playlist id
    const urlArray = window.location.toString().split('/');
    const playlistId = urlArray[urlArray.length - 1];

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
        displayModal('Your playlist has been updated! Redirecting...');

        setTimeout(() => {
            window.location.assign('/playlists')
        }, 2000);
    } else {
        const {message} = await response.json();

        displayModal(message);
    }
};

formEl.addEventListener('submit', formSubmitHandler);
