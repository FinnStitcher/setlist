const formEl = document.querySelector('#fl-form');
const nameInputEl = document.querySelector('#fl-name');
const selectedContainerEl = document.querySelector('#selected-pls');
const searchResultsContainerEl = document.querySelector('#pl-search-results');
const searchInputEl = document.querySelector('#pl-search');

// MEMO CODE
const userId = await fetch('/api/users/this-user').then(data => data.json());

// get this user's playlists
const thisUserPlaylists = await fetch('/api/users/' + userId + '/playlists').then(data => data.json()).then(json => json.playlists);
// END MEMO CODE

// SUBMIT CODE
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
        thisUserPlaylists.forEach(element => {
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

    // create new array by filtering thisUserPlaylists
    const filteredPlaylists = thisUserPlaylists.filter(element => {
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
// END MODAL CODE