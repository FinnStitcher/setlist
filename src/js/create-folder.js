const formEl = document.querySelector('#fl-form');
const nameInputEl = document.querySelector('#fl-name');
const selectedContainerEl = document.querySelector('#selected-pls');
const searchResultsContainerEl = document.querySelector('#pl-search-results');
const searchInputEl = document.querySelector('#pl-search');

// MEMO CODE
const userId = await fetch('/api/users/this-user').then(data => data.json());

// get this user's unsorted playlists
const thisUserUnsorted = await fetch('/api/users/' + userId + '/playlists/unsorted').then(data => data.json()).then(json => json.playlists);
// END MEMO CODE

// SUBMIT CODE
async function formSubmitHandler(event) {
    event.preventDefault();

    const name = nameInputEl.value.trim();

    // extract playlist ids
    const selectedPlaylists = $(selectedContainerEl).children();
    const selectedPlaylistIds = [];

    selectedPlaylists.each((i, el) => {
        selectedPlaylistIds.push($(el).attr('data-id'));
    });

    // check that name is present
    if (!name) {
        displayModal('Your folder needs a name.');
        return;
    }

    // create folder object
    const folderObj = {
        name: name,
        dateCreated: Date.now(),
        dateLastModified: Date.now(),
        playlists: [...selectedPlaylistIds],
        username: 'Anonymous' // dummy value, will be overwritten on the backend
    };

    // send req to server
    const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(folderObj)
    });
    const json = await response.json();

    if (!response.ok) {
        const {message} = json;

        displayModal(message);

        return;
    };

    // remove these playlists from all other folders
    const {_id: newFolderId} = json.folder;

    selectedPlaylistIds.forEach(async (element) => {
        const updateResponse = await fetch(`/api/playlists/${element}/update-folders`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folderId: newFolderId
            })
        });
        const updateJson = updateResponse.json();

        if (!updateResponse.ok) {
            const {message} = updateJson;

            displayModal(message);

            return;
        }
    });

    // function is still running at this point, so no failures were met
    displayModal('Your folder has been successfully created. Redirecting...');

    setTimeout(() => {
        window.location.assign('/folders');
    }, 2000);
};

formEl.addEventListener('submit', formSubmitHandler);
// END SUBMIT CODE

// FILTER CODE
async function searchInputHandler() {
    const {value} = searchInputEl;

    // selects if all whitespace
    const whitespaceRegex = /\B\s\B/;

    // making a jquery object out of the container
    const jSearchResultsContainer = $(searchResultsContainerEl);

    // clear
    jSearchResultsContainer.html('');

    if (!value || whitespaceRegex.test(value)) {
        // display all playlists
        thisUserUnsorted
    .forEach(element => {
            const listEl = $('<li>').attr('class', 'my-0 hover:bg-stone-300 cursor-grab').attr('data-id', element._id);
    
            const firstParaEl = $('<p>').attr('class', 'font-medium').text(element.title);
    
            const secondParaEl = $('<p>').attr('class', 'text-neutral-700 font-normal').text(element.songs.length + ' tracks');
    
            listEl.append(firstParaEl, secondParaEl);
            jSearchResultsContainer.append(listEl);
        });

        return;
    }

    // make a regex from the current value
    const filterRegex = new RegExp('\\b' + value, 'i');

    // create new array by filtering thisUserUnsorted

    const filteredPlaylists = thisUserUnsorted
.filter(element => {
        const {title} = element;
        return filterRegex.test(title);
    });

    // check if filteredPlaylists is empty
    if (!filteredPlaylists.length) {
        const noResultsMessageEl = $('<p>').text('None of your playlists match that search.');
        jSearchResultsContainer.append(noResultsMessageEl);
        return;
    }
    
    // print
    filteredPlaylists.forEach(element => {
        const listEl = $('<li>').attr('class', 'my-0 hover:bg-stone-300 cursor-grab').attr('data-id', element._id);

        const firstParaEl = $('<p>').attr('class', 'font-medium').text(element.title);

        const secondParaEl = $('<p>').attr('class', 'text-neutral-700 font-normal').text(element.songs.length + ' tracks');

        listEl.append(firstParaEl, secondParaEl);
        jSearchResultsContainer.append(listEl);
    });
};

searchInputEl.addEventListener('keyup', searchInputHandler);
// END FILTER CODE

// SORTABLE CODE
Sortable.create(selectedContainerEl, {
    group: {
        name: 'playlists'
    },
    animation: 150,
    ghostClass: 'opacity-0',
    dragClass: 'bg-stone-300'
});

Sortable.create(searchResultsContainerEl, {
    group: {
        name: 'playlists'
    },
    sort: false,
    animation: 150,
    ghostClass: 'opacity-0',
    dragClass: 'bg-stone-300'
});
// END SORTABLE CODE

// MODAL CODE
const modalEl = document.querySelector('#modal');
const modalCloseBtnEl = document.querySelector('#modal-close-btn');
const modalTextEl = document.querySelector('#modal p');

function displayModal(message) {
    modalTextEl.textContent = message;
    modalEl.showModal();
};

modalCloseBtn.addEventListener('click', () => {
    modalEl.close();
    
    if (modalTextEl.includes('Success')) {
        window.location.assign('/folders');
    }
});
// END MODAL CODE