// get data from form
// make fetch req to api
const formEl = document.getElementById('email-form');
const nameInputEl = document.getElementById('email-name');
const addressInputEl = document.getElementById('email-address');
const subjectInputEl = document.getElementById('email-subject');
const messageInputEl = document.getElementById('email-message');

async function sendEmail(event) {
    event.preventDefault();
    
    // validate
    // all values are required
    if (!nameInputEl.value || !addressInputEl.value || !subjectInputEl.value || !messageInputEl.value) {
        displayModal('Please fill out all fields in the email form.');
        return;
    };

    // extract data
    const emailObj = {
        name: nameInputEl.value,
        address: addressInputEl.value,
        subject: subjectInputEl.value,
        message: messageInputEl.value
    };

    const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailObj)
    });

    if (response.ok) {
        displayModal('Your email was sent! I\'ll get back to you as soon as I can.');
    } else {
        const {message} = await response.json();

        displayModal(message);
    }
};

formEl.addEventListener('submit', sendEmail);

const modal = document.getElementById('email-modal');
const modalCloseBtn = document.getElementById('email-modal-close-btn');
const modalText = document.querySelector('#email-modal p');

function displayModal(message) {
    modalText.textContent = message;
    modal.showModal();
};

modalCloseBtn.addEventListener('click', () => {
    modal.close();
});