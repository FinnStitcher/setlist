const songContainerEl = document.getElementById('song-container');
const songSearchInputEl = document.getElementById('song-search');

// event listener for the song search bar that will run on... what?
// lets try change and keypress
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
    
    songs.forEach(element => printSong(element));
};

function printSong(element) {
    const {title, artist, _id} = element;

    const songEl = document.createElement('p');
    songEl.textContent = `${title} - ${artist}`;
    songEl.setAttribute('data-id', _id);

    songContainerEl.appendChild(songEl);
};

songSearchInputEl.addEventListener('keyup', songSearchInputHandler);