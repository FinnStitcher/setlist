const formEl = document.getElementById('user-form');
const usernameInputEl = document.getElementById('username');
const passwordInputEl = document.getElementById('password');

const modal = document.querySelector('#modal');
const closeModal = document.querySelector('[data-btnuse="close-modal"]');

formEl.addEventListener('submit', signupHandler);

async function signupHandler(event) {
    event.preventDefault();

    const username = usernameInputEl.value.trim();
    const password = passwordInputEl.value.trim();

    if (username && password) {
        const response = await fetch('/api/users', {
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
            }, 3000);
        } else {
            const modalText = document.querySelector('dialog p');
            modalText.textContent = 'Something went wrong with signing you up. Most likely, something is wrong with the server, but double-check that your input is valid.';

            modal.showModal();
        }
    }
};