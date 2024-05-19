const request = require('request')

const email = '' // Enter email here!

request.post({
    url: 'http://localhost:3000/subscribe',
    form: { email },
    json: true
}, (error, res, body) => {
    console.log(error, body);
})