const formEl = document.getElementById('user-form');
const usernameInputEl = document.getElementById('username');
const passwordInputEl = document.getElementById('password');

const modal = document.querySelector('#modal');
const closeModal = document.querySelector('[data-btnuse="close-modal"]');

formEl.addEventListener('submit', loginHandler);

async function loginHandler(event) {
    event.preventDefault();

    const username = usernameInputEl.value.trim();
    const password = passwordInputEl.value.trim();

    if (username && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        if (response.ok) {
            modal.showModal();

            setTimeout(() => {
                window.location.assign('/playlists')
            }, 2500);
        } else {
            const modalText = document.querySelector('dialog p');
            modalText.textContent = 'Something went wrong with your log-in. Check your info and try again.';

            modal.showModal();
        }
    }
};

closeModal.addEventListener('click', () => {
    modal.close();
});