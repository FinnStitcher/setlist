const modal = document.querySelector('#link-modal');
const openModal = document.querySelector('[data-modal-btn="open-modal"]');
const closeModal = document.querySelector('[data-modal-btn="close-modal"]');

const profileUrl = document.querySelector('#profile-url');

openModal.addEventListener('click', () => {
    if (profileUrl) {
        profileUrl.textContent = window.location.origin + '/users/' + profileUrl.getAttribute('data-user-id');
    };

    modal.showModal();
});

closeModal.addEventListener('click', () => {
    modal.close();
});