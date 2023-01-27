import {printSong} from './client-utils.js';

// variables
const formEl = document.getElementById('song-form');
const suggestionContainerEl = document.getElementById('suggested-songs');

const titleInputEl = document.getElementById('song-title');
const artistInputEl = document.getElementById('song-artist');
const albumInputEl = document.getElementById('song-album');
const yearInputEl = document.getElementById('song-year');

// SONG FORM CODE
async function submitSongHandler(event) {
    event.preventDefault();

    // check that required values are present
    if (!titleInputEl.value || !artistInputEl.value) {
        displayModal('You need to include a title and artist, at minumum.');
        return;
    }

    const songObj = {
        title: titleInputEl.value,
        artist: artistInputEl.value
    };

    albumInputEl.value ? songObj.album = albumInputEl.value : null;
    yearInputEl.value ? songObj.year = yearInputEl.value : null;

    const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(songObj)
    });

    if (response.ok) {
        displayModal('Your song was submitted successfully! Redirecting...');

        setTimeout(() => {
            window.location.assign('/playlists')
        }, 2000);
    } else {
        const {message} = await response.json();

        displayModal(message);
    }
};

formEl.addEventListener('submit', submitSongHandler);
// END SONG FORM CODE

// SONG SUGGESTION CODE
async function songSuggestHandler(event) {
    // check if event was in a relevant input
    const isTitleOrArtist = event.target.matches('#song-title') || event.target.matches('#song-artist');

    if (isTitleOrArtist) {
        // make db request that will return songs with a matching title and/or artist

        // make query string
        let queryString = '?';
        titleInputEl.value ? queryString += `title=${titleInputEl.value}&` : null;
        artistInputEl.value ? queryString += `artist=${artistInputEl.value}` : null;

        const songs = await fetch('/api/songs/match' + queryString).then(dbRes => dbRes.json());

        suggestionContainerEl.innerHTML = '';

        // not going to display a "no results" message
        // this isn't a search, it's suggestions

        if (songs[0]) {
            songs.forEach(element => printSong(element, suggestionContainerEl));
        }
    }
};

formEl.addEventListener('keyup', songSuggestHandler);
// END SONG SUGGESTION CODE

// MODAL CODE
const modal = document.getElementById('song-modal');
const modalCloseBtn = document.getElementById('song-modal-close-btn');
const modalText = document.querySelector('#song-modal p');

function displayModal(message) {
    modalText.textContent = message;
    modal.showModal();
};

modalCloseBtn.addEventListener('click', () => {
    modal.close();
    window.location.assign('/playlists');
});
// END MODAL CODE