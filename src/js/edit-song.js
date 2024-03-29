import {printSong, printNoResultsMessage} from './client-utils.js';

// variables
const formEl = document.getElementById('song-form');
const titleInputEl = document.getElementById('song-title');
const artistInputEl = document.getElementById('song-artist');
const albumInputEl = document.getElementById('song-album');
const yearInputEl = document.getElementById('song-year');

const searchResultsCtnrEl = document.getElementById('search-results');
const searchInputEl = document.getElementById('search-input');

let selectedSongId = '';

// SONG SEARCH CODE
async function songSearchHandler(event) {
    const {value} = event.target;

    // if there's no value, the regex created on the backend will grab all songs
    // we don't want to have random songs displayed on the frontend
    // so we just don't make the search
    // using .trim() in case its all whitespace
    if (!value.trim()) {
        searchResultsCtnrEl.innerHTML = '';
        return;
    }

    // proceed with the search
    let queryString = '?';
    value ? queryString += `search=${value}` : null;

    const songs = await fetch('/api/songs/search/user' + queryString).then(dbRes => dbRes.json());

    // check that anything was returned
    if (!songs[0]) {
        printNoResultsMessage(searchResultsCtnrEl);
        return;
    }

    const shortSongs = songs.slice(0, 5);

    searchResultsCtnrEl.innerHTML = '';

    shortSongs.forEach(element => printSong(element, searchResultsCtnrEl));
};

// when a song in the search results is clicked, copy its data to the form
function songCopyToFormHandler(event) {
    const {target} = event;
    const isLi = target.matches('li') || target.matches('li p') || target.matches('li p i');

    if (isLi) {
        // streamlines the code if i don't have to account for multiple possible targets
        const listEl = target.closest('li');

        // get data from list item

        selectedSongId = listEl.getAttribute('data-id');
        const title = listEl.children[0].textContent;

        // innerHTML instead of textContent so we can tell if there's an album or not
        const extraInfoArr = listEl.children[1].innerHTML.split(', ');

        // artist is required, so extraInfoArr[0] will always be the artist name
        const artist = extraInfoArr[0];

        let year = null;
        let album = null;

        if (extraInfoArr.length === 3) {
            year = extraInfoArr[1];
            album = extraInfoArr[2];
        } else if (extraInfoArr.length === 2) {
            // check if the other piece of data in the array is the album (in italics) or the year
            const secondItem = extraInfoArr[1];

            if (secondItem.includes('<i>')) {
                album = secondItem;
            } else {
                year = secondItem;
            }
        }
        // if length === 1, there was only one item in the array, the artist, which has already been saved to a variable

        // put the collected data into the form
        titleInputEl.value = title;
        artistInputEl.value = artist;
        albumInputEl.value = album.replace('<i>', '').replace('</i>', '');
        yearInputEl.value = year;

        // unhide form
        formEl.className = "";
    }
};

searchInputEl.addEventListener('keyup', songSearchHandler);
searchResultsCtnrEl.addEventListener('dblclick', songCopyToFormHandler);
// END SONG SEARCH CODE

// SONG FORM CODE
async function songSubmitHandler(event) {
    event.preventDefault();

    // check that required values are present
    if (!titleInputEl.value || !artistInputEl.value) {
        displayModal('You need to include a title and artist, at minumum.');
        return;
    }

    const songObj = {
        title: titleInputEl.value,
        artist: artistInputEl.value,
        album: albumInputEl.value,
        year: yearInputEl.value
    };

    const response = await fetch('/api/songs/' + selectedSongId, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(songObj)
    });

    if (response.ok) {
        displayModal('This song was updated successfully. Refreshing the page...');

        setTimeout(() => {
            window.location.assign('/edit-song')
        }, 2000);
    } else {
        const {message} = await response.json();

        displayModal(message);
    }
};

formEl.addEventListener('submit', songSubmitHandler);
// END SONG FORM CODE

// MODAL CODE
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalText = document.querySelector('#modal p');

function displayModal(message) {
    modalText.textContent = message;
    modal.showModal();
};

modalCloseBtn.addEventListener('click', () => {
    modal.close();
    window.location.assign('/edit-song');
});
// END MODAL CODE