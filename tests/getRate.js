const request = require('request')

request.get({
    url: 'http://localhost:3000/rate',
}, (error, res, body) => {
    console.log(error, body);
})