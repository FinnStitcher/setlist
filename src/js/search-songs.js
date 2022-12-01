const songContainerEl = document.getElementById('song-container');
const songSearchInputEl = document.getElementById('song-search');

function songSearchInputHandler(event) {
    const {value} = event.target;
    
    // make sure there's actually text in the search bar
    if (value) {
        searchSongs(value);
    }
};

async function searchSongs(value) {
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
};

function printSong(element) {
    const {title, artist, _id} = element;

    const songEl = document.createElement('p');
    songEl.textContent = `${title} - ${artist}`;
    songEl.setAttribute('data-id', _id);

    songContainerEl.appendChild(songEl);
};

function printNoResultsMessage() {
    const messageEl = document.createElement('p');
    messageEl.textContent = 'No songs matching your search were found.';

    songContainerEl.appendChild(messageEl);
};

songSearchInputEl.addEventListener('keyup', songSearchInputHandler);