// proof of concept works
// i'm actually going to rewrite things so the email sending happens on the backend
// i'll keep the key in its env variable, set my emailjs account to allow non-browser messages, and install the relevant npm package

async function testFn() {
    const key = await fetch('/api/email').then(data => data.json());

    const testObj = {
        service_id: 'service_setlist',
        template_id: 'template_setlist',
        user_id: key,
        template_params: {
            'email-name': 'name',
            'email-address': 'email@email.com',
            'email-subject': 'this is an email',
            'email-message': 'emailing you'
        }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testObj)
    });

    console.log(response);
};

testFn();