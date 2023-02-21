import {printSong, printNoResultsMessage} from './client-utils.js';

// PLAYLIST FORM CODE
const formEl = document.getElementById('playlist-form');
const titleInputEl = document.getElementById('playlist-name');

async function formSubmitHandler(event) {
	event.preventDefault();

    const title = titleInputEl.value;

    // extract song ids
    const selectedSongs = $('#selected-songs').children();
    const selectedSongIds = [];

    selectedSongs.each(function (i, el) {
        selectedSongIds.push($(el).attr('data-id'));
    });

    // check that title is present
    if (!title) {
        displayModal('You need to add a title.');
        return;
    }

	// create playlist object
	const playlistObj = {
		title: title,
		dateCreated: Date.now(),
		dateLastModified: Date.now(),
		songs: [...selectedSongIds],
		username: 'Anonymous' // dummy value, should be overwritten on the backend
	};

	// send req to server
	const response = await fetch('/api/playlists', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(playlistObj)
	});
    
    if (response.ok) {
        displayModal('Your playlist was successfully created! Redirecting...');

        setTimeout(() => {
            window.location.assign('/playlists');
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
// END SONG SEARCH CODE

// SORTABLE CODE
// make songs sortable
Sortable.create(selectedContainerEl, {
    group: {
        name: 'songs'
    },
    animation: 150,
    ghostClass: 'opacity-0',
    dragClass: 'bg-stone-300'
});

// make search results sortable
Sortable.create(searchResultsContainerEl, {
    group: {
        name: 'songs'
    },
    sort: false,
    animation: 150,
    ghostClass: 'opacity-0',
    dragClass: 'bg-stone-300'
});
// END SORTABLE CODE

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