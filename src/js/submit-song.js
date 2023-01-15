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

    // make sure both required fields are present
    if (!songObj.title || !songObj.artist) {
        console.log('missing required data');
        // TODO: onscreen error message
        return;
    }

    // check if there's a song in the db that *exactly* matches this title + artist
    const exactMatchRes = await checkExactMatch(songObj);
    const hasExactMatch = !!exactMatchRes;

    if (hasExactMatch) {
        // check if this submission has more data than the one in the database
        const hasNewAlbumData = !!(songObj.album && !exactMatchRes.album);
        const hasNewYearData = !!(songObj.year && !exactMatchRes.year);

        if (!hasNewAlbumData && !hasNewYearData) {
            // TODO: display 'did nothing' message
            return;
        }

        const updateRes = await fetch('/api/songs/' + exactMatchRes._id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(songObj)
        });
        // no .then because we don't need the response data

        if (updateRes.ok) {
            // TODO: confirm update before redirect
            window.location.assign('/playlists');
        } else {
            // TODO: display error
            console.log('error in attempted update');
            console.log(updateRes.status);
        }

        return;
    }

    const createRes = await fetch('/api/songs', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(songObj)
    });
    // no .then because we don't need the response data

    if (createRes.ok) {
        // TODO: confirm submit before redirect
        window.location.assign('/playlists');
    } else {
        // TODO: display error
        console.log('error in attempted submit');
        console.log(updateRes.status);
    }
};

async function checkExactMatch(songObj) {
    // make query string
    // incoming object will have, at minimum, a title and artist
    let queryString = '?';
    songObj.title ? queryString += `title=${titleInputEl.value}&` : null;
    songObj.artist ? queryString += `artist=${artistInputEl.value}` : null;

    const response = await fetch('/api/songs/match/exact' + queryString).then(dbRes => dbRes.json());

    if (!response.ok) {
        console.log(response.status);
    }
    
    return response;
};