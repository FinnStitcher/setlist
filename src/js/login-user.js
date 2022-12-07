const formEl = document.getElementById('login-form');
const usernameInputEl = document.getElementById('username');
const passwordInputEl = document.getElementById('password');

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
            // TODO: Confirm login
            window.location.assign('/playlists');
        } else {
            console.log('something went wrong');
        }
    }
};