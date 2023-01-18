const formEl = document.getElementById('user-form');
const usernameInputEl = document.getElementById('username');
const passwordInputEl = document.getElementById('password');

const signupModal = document.getElementById('signup-modal');
const signupModalCloseBtn = document.getElementById('signup-modal-close-btn');
const modalText = document.querySelector('#signup-modal p');

function displayModal(message) {
    modalText.textContent = message;
    signupModal.showModal();
};

async function signupHandler(event) {
    event.preventDefault();

    const username = usernameInputEl.value.trim();
    const password = passwordInputEl.value.trim();

    // check that both fields are filled
    if (!username || !password) {
        displayModal('Please fill out both input boxes and try again.');
        return;
    }

    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });

    if (response.ok) {
        displayModal("Congratulations on your new Setlist account! You're logged in. Redirecting...");

        setTimeout(() => {
            window.location.assign('/playlists')
        }, 3000);
    } else {
        const {message} = await response.json();

        displayModal(message);
    }
};

formEl.addEventListener('submit', signupHandler);

signupModalCloseBtn.addEventListener('click', () => {
    signupModal.close();
});