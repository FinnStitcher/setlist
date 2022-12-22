const modal = document.querySelector('#modal');
const openModal = document.querySelector('[data-btnuse="open-modal"]');
const closeModal = document.querySelector('[data-btnuse="close-modal"]');

const profileUrl = document.querySelector('#profile-url');

openModal.addEventListener('click', () => {
    if (profileUrl) {
        profileUrl.textContent = window.location.origin + '/users/' + profileUrl.getAttribute('data-userid');
    };

    modal.showModal();
});

closeModal.addEventListener('click', () => {
    modal.close();
});