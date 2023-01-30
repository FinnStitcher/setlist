export function printSong(element, placeToAppend) {
    const {_id, title, artist, year, album} = element;

    // format artist, year, and album into a string
    let extraInfoString = artist;
    year ? extraInfoString += `, ${year}` : null;
    album ? extraInfoString += `, <i>${album}</i>` : null;

    const listEl = document.createElement('li');
    listEl.setAttribute('class', 'my-0');
    listEl.setAttribute('data-id', _id);

    listEl.innerHTML = `<p class="font-medium">${title}</p>
    <p class="text-neutral-700 font-normal">${extraInfoString}</p>`;

    placeToAppend.appendChild(listEl);
};

export function printNoResultsMessage(placeToAppend) {
    const messageEl = document.createElement('p');
    messageEl.textContent = 'No songs matching your search were found.';

    placeToAppend.innerHTML = '';
    placeToAppend.appendChild(messageEl);
};

export function songSelectHandler(event, placeToPush, placeToAppend) {
    const {target} = event;

    const isLi = target.matches('li') || target.matches('li p') || target.matches('li p i');

    if (!isLi) {
        return;
    }

    // streamlining the code by storing the relevant list item in a variable
    // this way, if the user clicked one of the paragraph tags,
    // we don't need a different set of logic
    const listItemEl = target.matches('li') ? target : target.closest('li');

    // check if there's a match in selectedSongIds
    const targetId = listItemEl.getAttribute('data-id');
    const isAlreadySelected = placeToPush.indexOf(targetId) !== -1;

    // remove the target from the dom
    // this way you can't put a song in a playlist twice
    if (isAlreadySelected) {
        listItemEl.remove();
        return;
    }

    // else, add it to the selection
    placeToPush.push(targetId);
    placeToAppend.appendChild(listItemEl);
};

export function songDeselectHandler(event, searchTerm, placeToPull, placeToAppend) {
    const {target} = event;
    
    const isLi = target.matches('li') || target.matches('li p') || target.matches('li p i');

    if (!isLi) {
        return;
    }

    // see comments in songSelectHandler
    const listItemEl = target.matches('li') ? target : target.closest('li');

    //const searchTerm = songSearchInputEl.value;
    const searchRegex = new RegExp('\\b' + searchTerm, 'i');

    const songTitle = listItemEl.children[0].textContent.trim();
    const songId = listItemEl.getAttribute('data-id');

    // check if this song can appear in the current search
    if (searchTerm && searchRegex.test(songTitle)) {
        // check if it *does* appear in the current search
        // for now letting this be hardcoded because
        // this function is used on playlist forms with a standardized structure
        const isInSearchResults = !!document.querySelector(`#song-search-results [data-id="${songId}"]`);

        // this song is in the search results (already in the dom), so we can just delete it
        if (isInSearchResults) {
            listItemEl.remove();
        } else {
            // move this song to the search results container
            placeToAppend.appendChild(listItemEl);
        }
    } else {
        // song cannot appear in current search, so we delete it
        listItemEl.remove();
    }

    // remove from selectedSongsForSearch
    const indexOfRemoved = placeToPull.indexOf(songId);
    placeToPull.splice(indexOfRemoved, 1);
};