const plContainerEl = document.getElementById('playlist-container');

function togglePlaylistHandler(e) {
    const {target} = e;

    // will be true if the header div or the text in it was clicked
    const isTitle = target.matches('.pl-title, .pl-title h3, .pl-title p');

    if (isTitle) {
        // get the ul associated with that title
        const playlistBody = target.closest('.pl-title').nextElementSibling;
        // get the arrow
        const arrow = target.closest('.pl-title').querySelector('.pl-arrow');
        
        if (playlistBody.matches('.hidden')) {
            playlistBody.className = 'block';
            arrow.textContent = '▲';
        } else if (playlistBody.matches('.block')) {
            playlistBody.className = 'hidden';
        
            arrow.textContent = '▲';
        }
    }
};

plContainerEl.addEventListener('click', togglePlaylistHandler);