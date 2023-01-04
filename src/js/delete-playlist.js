const playlistContainerEl = document.getElementById('playlist-container');

const confirmDelModal = document.getElementById('confirm-del-modal');
const delCompleteModal = document.getElementById('del-complete-modal');

const confirmDelBtn = document.getElementById('confirm-del-btn');
const closeConfirmDelBtn = document.getElementById('confirm-del-close-btn');
const closeDelCompleteBtn = document.getElementById('del-complete-close-btn');

async function deleteButtonHandler(event) {
    const {target} = event;

    if (target.matches('[data-btn-type="del-btn"]')) {
        const id = target.getAttribute('data-id');

        // TODO: display confirmation popup
        confirmDelModal.showModal();

        confirmDelBtn.addEventListener('click', () => {
            deletePlaylist(id);
            confirmDelModal.close();
        });
        
        closeConfirmDelBtn.addEventListener('click', () => {
            confirmDelModal.close();
        });
    }
};

async function deletePlaylist(id) {
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
        delCompleteModal.showModal();

        closeDelCompleteBtn.addEventListener('click', () => {
            delCompleteModal.close();
        });

        // refresh page
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
};

playlistContainerEl.addEventListener('click', deleteButtonHandler);