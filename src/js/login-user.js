const formEl = document.getElementById('user-form');
const usernameInputEl = document.getElementById('username');
const passwordInputEl = document.getElementById('password');

const loginModal = document.getElementById('login-modal');
const loginModalCloseBtn = document.getElementById('login-modal-close-btn');
const modalText = document.querySelector('#login-modal p');

function displayModal(message) {
    modalText.textContent = message;
    loginModal.showModal();
};

async function loginHandler(event) {
    event.preventDefault();

    const username = usernameInputEl.value.trim();
    const password = passwordInputEl.value.trim();

    // check that both fields are filled
    if (!username || !password) {
        displayModal('Please fill out both input boxes and try again.');
        return;
    }

    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });

    if (response.ok) {
        displayModal("You're logged in. Redirecting you now...");

        setTimeout(() => {
            window.location.assign('/playlists');
        }, 1800);
    } else {
        const {message} = await response.json();

        displayModal(message);
    }
};

formEl.addEventListener('submit', loginHandler);

loginModalCloseBtn.addEventListener('click', () => {
    loginModal.close();
});