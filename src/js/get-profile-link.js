const linkModal = document.getElementById('link-modal');
const linkModalBtn = document.getElementById('link-modal-btn');
const linkModalCloseBtn = document.getElementById('link-modal-close-btn');

const profileUrl = document.querySelector('#profile-url');

linkModalBtn.addEventListener('click', () => {
    if (profileUrl) {
        profileUrl.textContent = window.location.origin + '/users/' + profileUrl.getAttribute('data-user-id');
    };

    linkModal.showModal();
});

linkModalCloseBtn.addEventListener('click', () => {
    linkModal.close();
});