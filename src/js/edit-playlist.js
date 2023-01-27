import {printSong, printNoResultsMessage, songSelectHandler, songDeselectHandler} from './client-utils.js';

// array for the ids of songs in the playlist
const selectedSongIds = [];

// PLAYLIST FORM CODE
const formEl = document.getElementById('playlist-form');
const titleInputEl = document.getElementById('playlist-name');

async function formSubmitHandler(event) {
	event.preventDefault();

    const title = titleInputEl.value;

    // check that title is present
    if (!title) {
        displayModal('A title is required.');
        return;
    }

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
// END PLAYLIST FORM CODE

// SONG SEARCH CODE
const songSearchInputEl = document.getElementById('song-search');
const searchResultsContainerEl = document.getElementById('song-search-results');
const selectedContainerEl = document.getElementById('selected-songs');

async function songSearchInputHandler() {
    const {value} = songSearchInputEl;

    // regexp that selects whitespace
    const whitespaceRegex = /\B\s\B/;

    // make sure there's actually text in the search bar
    if (!value || whitespaceRegex.test(value)) {
        searchResultsContainerEl.innerHTML = '';
        return;
    }
    
    // there is text, now we can make the search

    // get songs matching input from db
    const songs = await fetch('/api/songs/search/' + value).then(dbRes => dbRes.json());

    // wipe song container
    searchResultsContainerEl.innerHTML = '';

    // if no songs were returned, print message
    // songs will be an array, so we need to specifically check if there's no first array item
    if (!songs[0]) {
        printNoResultsMessage(searchResultsContainerEl);
        return;
    }

    // else, print out the songs
    songs.forEach(element => printSong(element, searchResultsContainerEl));

    // TODO: extra processing to not print songs that are already on this playlist
};

// lets the user make searches
songSearchInputEl.addEventListener('keyup', songSearchInputHandler);

// double-clicking a song will add it to the selection list
searchResultsContainerEl.addEventListener('dblclick', function(event) {
    songSelectHandler(event, selectedSongIds, selectedContainerEl);
});

// double-clicking a selected song will remove it from that list
selectedContainerEl.addEventListener('dblclick', function(event) {
    songDeselectHandler(event, songSearchInputEl.value, selectedSongIds, searchResultsContainerEl);
});
// END SONG SEARCH CODE

// MODAL CODE
const playlistModal = document.getElementById('pl-modal');
const playlistModalCloseBtn = document.getElementById('pl-modal-close-btn');
const modalText = document.querySelector('#pl-modal p');

function displayModal(message) {
    modalText.textContent = message;
    playlistModal.showModal();
};

playlistModalCloseBtn.addEventListener('click', () => {
    playlistModal.close();
    window.location.assign('/playlists');
});
// END MODAL CODE