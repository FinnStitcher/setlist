const songContainerEl = document.getElementById('song-container');
const songSearchInputEl = document.getElementById('song-search');
const selectionContainerEl = document.getElementById('selected-songs');

// used in songSelectHandler to check for duplicates
const selectedSongIds = [];

// lets the user make searches
songSearchInputEl.addEventListener('keyup', songSearchInputHandler);

// double-clicking a song will add it to the selection list
songContainerEl.addEventListener('dblclick', songSelectHandler);

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
    }
};

async function searchSongs() {
    const {value} = songSearchInputEl;
    // get songs matching input from db
    const songs = await fetch('/api/songs/search/' + value).then(dbRes => dbRes.json());

    // wipe song container
    songContainerEl.innerHTML = '';

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

    songContainerEl.appendChild(songEl);
};

function printNoResultsMessage() {
    const messageEl = document.createElement('p');
    messageEl.textContent = 'No songs matching your search were found.';

    songContainerEl.appendChild(messageEl);
};

function songSelectHandler(event) {
    const {target} = event;

    const isLi = target.matches('li');

    if (isLi) {
        // make sure there isn't an element in selectionContainerEl with this data-id property
        const targetId = target.getAttribute('data-id');

        if (selectedSongIds.indexOf(targetId) !== -1) {
            target.remove();
            return;
        }

        selectedSongIds.push(targetId);
        // make a clone of this element in selectionContainerEl
        selectionContainerEl.appendChild(target);
    }
};

function songDeselectHandler(event) {
    const {target} = event;
    
    const isLi = target.matches('li') || target.matches('li p');

    if (isLi) {
        songContainerEl.appendChild(target.closest('li'));
        
        // does not give desired behavior
        // desired behavior:
        // - if song could appear in current search, it moves down to that box
        // - if it could not appear in current search, it disappears
        // - if it already appears in current search, it disappears
    }
};