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
        printNoResultsMessage();
        return;
    }

    // else, print out the songs
    songs.forEach(element => printSong(element));

    // TODO: extra processing to not print songs that are already on this playlist
};

function printSong(element) {
    const {title, artist, year, album} = element;

    // format artist, year, and album into a string
    let extraInfoString = artist;
    year ? extraInfoString += `, ${year}` : null;
    album ? extraInfoString += `, <i>${album}</i>` : null;

    const listEl = document.createElement('li');
    listEl.setAttribute('class', 'my-0');

    listEl.innerHTML = `<p class="font-medium">${title}</p>
    <p class="text-neutral-700 font-normal">${extraInfoString}</p>`;

    suggestionContainerEl.appendChild(listEl);
};

function printNoResultsMessage() {
    const messageEl = document.createElement('p');
    messageEl.textContent = 'No songs matching your search were found.';

    searchResultsContainerEl.appendChild(messageEl);
};

function songSelectHandler(event) {
    const {target} = event;

    const isLi = target.matches('li');

    if (!isLi) {
        return;
    }

    // check if there's a match in selectedSongsForSearch
    const targetId = target.getAttribute('data-id');
    const isAlreadySelected = selectedSongIds.indexOf(targetId) !== -1;

    // remove the target from the dom
    // this way you can't put a song in a playlist twice
    if (isAlreadySelected) {
        target.remove();
        return;
    }

    // else, add it to the selection
    selectedSongIds.push(targetId);
    selectedContainerEl.appendChild(target);
};

function songDeselectHandler(event) {
    const {target} = event;
    
    const isLi = target.matches('li');

    if (!isLi) {
        return;
    }

    const searchTerm = songSearchInputEl.value;
    const searchRegex = new RegExp('\\b' + searchTerm, 'i');

    const songTitle = target.textContent.split(' - ')[0].trim();
    const songId = target.getAttribute('data-id');

    // check if this song can appear in the current search
    if (searchTerm && searchRegex.test(songTitle)) {
        // check if it *does* appear in the current search
        const isInSearchResults = !!document.querySelector(`#song-search-results [data-id="${songId}"]`);

        // this song is in the search results (already in the dom), so we can just delete it
        if (isInSearchResults) {
            target.remove();
        } else {
            // move this song to the search results container
            searchResultsContainerEl.appendChild(target);
        }
    } else {
        // song cannot appear in current search, so we delete it
        target.remove();
    }

    // remove from selectedSongsForSearch
    const indexOfRemoved = selectedSongIds.indexOf(songId);
    selectedSongIds.splice(indexOfRemoved, 1);
};

// lets the user make searches
songSearchInputEl.addEventListener('keyup', songSearchInputHandler);

// double-clicking a song will add it to the selection list
searchResultsContainerEl.addEventListener('dblclick', songSelectHandler);

// double-clicking a selected song will remove it from that list
selectedContainerEl.addEventListener('dblclick', songDeselectHandler);
// END SONG SEARCH CODE

// MODAL CODE
const playlistModal = document.getElementById('pl-modal');
const playlistModalCloseBtn = document.getElementById('pl-modal-close-btn');
const modalText = document.querySelector('#pl-modal p');

function displayModal(message) {
    modalText.textContent = message;
    playlistModal.showModal();
};
// END MODAL CODE