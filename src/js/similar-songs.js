const suggestionContainerEl = document.getElementById('suggested-songs');
const formEl = document.getElementById('song-form');
const titleInputEl = document.getElementById('song-title');
const artistInputEl = document.getElementById('song-artist');

formEl.addEventListener('keyup', songSuggestHandler);

async function songSuggestHandler(event) {
    // check if event was in a relevant input
    const isTitleOrArtist = event.target.matches('#song-title') || event.target.matches('#song-artist');

    if (isTitleOrArtist) {
        // make db request that will return songs with a matching title and/or artist
        // print them on the page

        // make query string
        let queryString = '?';
        titleInputEl.value ? queryString += `title=${titleInputEl.value}&` : null;
        artistInputEl.value ? queryString += `artist=${artistInputEl.value}` : null;

        const songs = await fetch('/api/songs/match' + queryString).then(dbRes => dbRes.json());

        suggestionContainerEl.innerHTML = '';

        if (songs[0]) {
            songs.forEach(element => printSong(element));
        }
    }
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

    suggestionContainerEl.appendChild(listEl);d
};