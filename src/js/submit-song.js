// const formEl = document.getElementById('song-form');
// const titleInputEl = document.getElementById('song-title');
// const artistInputEl = document.getElementById('song-artist');
// above variables are declared in a different script attached to the same page
const albumInputEl = document.getElementById('song-album');
const yearInputEl = document.getElementById('song-year');

formEl.addEventListener('submit', submitSongHandler);

async function submitSongHandler(event) {
    event.preventDefault();

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
        // TODO: confirm submit before redirect
        window.location.assign('/playlists');
    }
}