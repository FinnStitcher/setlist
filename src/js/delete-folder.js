const folderContainer = document.querySelector('#folder-container');

const confirmDelModal = document.querySelector('#confirm-del-modal');
const confirmDelBtn = document.querySelector('#confirm-del-btn');
const closeConfirmDelBtn = document.querySelector('#confirm-del-close-btn');

const delCompleteModal = document.getElementById('del-complete-modal');
const closeDelCompleteBtn = document.getElementById('del-complete-close-btn');
const delCompleteText = document.querySelector('#del-complete-modal p');

// checks if a delete button has been clicked
async function deleteButtonHandler(event) {
    const {target} = event;

    if (target.matches('[data-btn-type="del-fl-btn"]')) {
        const id = target.getAttribute('data-id');

        confirmDelModal.showModal();

        // declaring these event listeners in here because deleteFolder needs the id
        // which isn't available until the button is clicked
        confirmDelBtn.addEventListener('click', () => {
            deleteFolder(id);
            confirmDelModal.close();
        });
        
        closeConfirmDelBtn.addEventListener('click', () => {
            confirmDelModal.close();
        });
    }
};

// deletes the folder
async function deleteFolder(id) {
    // make req to delete folder
    const delFolderRes = await fetch('/api/folders/' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (delFolderRes.ok) {
        delCompleteModal.showModal();

        // refresh
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } else {
        const {message} = await delFolderRes.json();

        delCompleteText.textContent = message;
    }
}

folderContainer.addEventListener('click', deleteButtonHandler);

closeDelCompleteBtn.addEventListener('click', () => {
    delCompleteModal.close();
    window.location.reload();
});