const plContainerEl = document.getElementById('playlist-container');

function togglePlaylistHandler(e) {
    const {target} = e;

    // will be true if the header div or the text in it was clicked
    const isTitle = target.matches('.pl-title, .pl-title h3, .pl-title p');

    if (isTitle) {
        // get the ul associated with that title
        const playlistBody = target.closest('.pl-title').nextElementSibling;
        
        if (playlistBody.matches('.hidden')) {
            // toggle visibility
            playlistBody.className = 'block';

            // switch arrow
            if (target.matches('.pl-title')) {
                // if target is the div, get the last child and change its text
                target.lastElementChild.textContent = '▲';
            } else if (target.matches('.pl-title h3')) {
                // if target is the h3 tag, get the sibling
                target.nextElementSibling.textContent = '▲';
            } else if (target.matches('.pl-title p')) {
                // if target is the arrow, get self
                target.textContent = '▲';
            }
        } else if (playlistBody.matches('.block')) {
            // toggle visibility
            playlistBody.className = 'hidden';

            // switch arrow
            if (target.matches('.pl-title')) {
                // if target is the div, get the last child and change its text
                target.lastElementChild.textContent = '▼';
            } else if (target.matches('.pl-title h3')) {
                // if target is the h3 tag, get the sibling
                target.nextElementSibling.textContent = '▼';
            } else if (target.matches('.pl-title p')) {
                // if target was the arrow, get self
                target.textContent = '▼';
            }
        }
    }
};

plContainerEl.addEventListener('click', togglePlaylistHandler);