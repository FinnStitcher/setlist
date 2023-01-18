const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', logoutHandler);

function logoutHandler() {
    // TODO: are you sure you want to log out?

    fetch('/api/users/logout', {
        method: 'DELETE'
    })
    .then(response => {
        // TODO: warn of redirect
        window.location.assign('/');
    });
};