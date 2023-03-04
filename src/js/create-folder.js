const formEl = document.querySelector('#fl-form');
const nameInputEl = document.querySelector('#fl-name');
const selectedContainerEl = document.querySelector('#selected-pls');
const searchResultsContainerEl = document.querySelector('#pl-search-results');

// SUBMIT CODE
// END SUBMIT CODE

// FILTER CODE
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