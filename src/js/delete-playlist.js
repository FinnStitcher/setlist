const playlistContainerEl = document.getElementById('playlist-container');

const confirmDelModal = document.getElementById('confirm-del-modal');
const confirmDelBtn = document.getElementById('confirm-del-btn');
const closeConfirmDelBtn = document.getElementById('confirm-del-close-btn');

const delCompleteModal = document.getElementById('del-complete-modal');
const closeDelCompleteBtn = document.getElementById('del-complete-close-btn');
const delCompleteText = document.querySelector('#del-complete-modal p');

// checks if a delete button has been clicked
async function deleteButtonHandler(event) {
    const {target} = event;

    if (target.matches('[data-btn-type="del-btn"]')) {
        const id = target.getAttribute('data-id');

        confirmDelModal.showModal();

        // declaring these event listeners in here because deletePlaylist needs the playlist id
        // which isn't available until the button is clicked
        confirmDelBtn.addEventListener('click', () => {
            deletePlaylist(id);
            confirmDelModal.close();
        });
        
        closeConfirmDelBtn.addEventListener('click', () => {
            confirmDelModal.close();
        });
    }
};

// deletes the playlist
async function deletePlaylist(id) {
    // make req
    const response = await fetch('/api/playlists/' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        delCompleteModal.showModal();

        // refresh page
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } else {
        const {message} = await response.json();

        delCompleteText.textContent = message;
    }
};

playlistContainerEl.addEventListener('click', deleteButtonHandler);

closeDelCompleteBtn.addEventListener('click', () => {
    delCompleteModal.close();
});