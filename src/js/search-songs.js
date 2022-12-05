const songSearchInputEl = document.getElementById('song-search');
const searchResultsContainerEl = document.getElementById('song-search-results');
const selectionContainerEl = document.getElementById('selected-songs');

// used in songSelectHandler to check for duplicates
const selectedSongIds = [];

// lets the user make searches
songSearchInputEl.addEventListener('keyup', songSearchInputHandler);

// double-clicking a song will add it to the selection list
searchResultsContainerEl.addEventListener('dblclick', songSelectHandler);

// double-clicking a selected song will remove it from that list
selectionContainerEl.addEventListener('dblclick', songDeselectHandler);

// initial check - are there songs in the selectionContainerEl?
function checkIfEditMode() {
    if (selectionContainerEl.children) {
        // select all children of selectionContainerEl
        const selectedSongEls = document.querySelectorAll('#selected-songs li');

        // store selected song ids
        // this ensures correct functionality if you're editing an existing playlist
        selectedSongEls.forEach(element => {
            const id = element.getAttribute('data-id');
            selectedSongIds.push(id);
        });
    }
};

checkIfEditMode();

function songSearchInputHandler(event) {
    const {value} = event.target;

    // regexp that excludes whitespace
    const notWhitespaceRegex = /\S/;
    
    // make sure there's actually text in the search bar
    if (value && notWhitespaceRegex.test(value)) {
        searchSongs();
        return;
    }

    if (!value) {
        searchResultsContainerEl.innerHTML = '';
    }
};

async function searchSongs() {
    const {value} = songSearchInputEl;
    // get songs matching input from db
    const songs = await fetch('/api/songs/search/' + value).then(dbRes => dbRes.json());

    // wipe song container
    searchResultsContainerEl.innerHTML = '';

    // if no songs were returned, print message
    if (!songs[0]) {
        printNoResultsMessage();
        return;
    }

    songs.forEach(element => printSong(element));
    // need to do some kind of extra processing to not print songs that are already in this playlist
};

function printSong(element) {
    const {title, artist, _id} = element;

    const songEl = document.createElement('li');
    songEl.textContent = `${title} - ${artist}`;
    songEl.setAttribute('data-id', _id);

    searchResultsContainerEl.appendChild(songEl);
};

function printNoResultsMessage() {
    const messageEl = document.createElement('p');
    messageEl.textContent = 'No songs matching your search were found.';

    searchResultsContainerEl.appendChild(messageEl);
};

function songSelectHandler(event) {
    const {target} = event;

    const isLi = target.matches('li');

    if (isLi) {
        // check if there's a match in selectedSongIds
        const targetId = target.getAttribute('data-id');
        const isAlreadySelected = selectedSongIds.indexOf(targetId) !== -1;

        if (isAlreadySelected) {
            target.remove();
            return;
        }

        // else, add it to the selection
        selectedSongIds.push(targetId);
        selectionContainerEl.appendChild(target);
    }
};

function songDeselectHandler(event) {
    const {target} = event;
    
    const isLi = target.matches('li');

    if (isLi) {
        // code to avoid having duplicates in the search results box
        const searchTerm = songSearchInputEl.value;
        const searchRegex = new RegExp('\\b' + searchTerm, 'i');

        const songTitle = target.textContent.split(' - ')[0].trim();
        const songId = target.getAttribute('data-id');

        // check if this song can appear in the current search
        if (searchTerm && searchRegex.test(songTitle)) {
            // check if it *does* appear in the current search
            const isInSearchResults = !!document.querySelector(`#song-search-results [data-id="${songId}"]`);

            if (isInSearchResults) {
                target.remove();
            } else {
                searchResultsContainerEl.appendChild(target);
            }
        } else {
            // song cannot appear in current search
            target.remove();
        }

        // remove from selected id array
        const indexOfRemoved = selectedSongIds.indexOf(songId);
        selectedSongIds.splice(indexOfRemoved, 1);
    }
};