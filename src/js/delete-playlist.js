const playlistContainerEl = document.getElementById('playlist-container');

async function deleteButtonHandler(event) {
    const {target} = event;

    if (target.matches('[data-btn-type="del-btn"]')) {
        const id = target.getAttribute('data-id');

        // TODO: display confirmation popup
        document.getElementById('confirm-del-modal').showModal();

        // make fetch req to database to delete playlist
        const response = await fetch('/api/playlists/' + id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // TODO: display successful delete popup
            // refresh page
            window.location.reload();
        }
    }
};

playlistContainerEl.addEventListener('click', deleteButtonHandler);