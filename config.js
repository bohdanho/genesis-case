module.exports = {
    PORT: 3000, // Rort on which the application would work

    EMAIL: { 
        username: 'belgiumbohdanho@gmail.com',
        password: 'rdhd fthz wysi ydkp'
    },

    CURRENCY_CODE: 'USD', // Currency code for the exchange rate
    DELAYS: { // Different delays used throughout the application
        ERROR: 2000, // Timeout used before a retry of the failed request
        EXCHANGE_RATE: 5 * 60 * 1000, // Exchange rates would be updated once every 5 minutes,
        EMAIL_NOTIFICATION: 24 * 60 * 60 * 1000, // Users would be notified on the updated exchange rate once every 24 hours
    }
}