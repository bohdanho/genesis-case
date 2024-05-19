const request = require('request')

const config = require('../config')

const data = { exchangeRate: null, updatedAt: null }

function retry(message, timeout, func, ...args) {
    console.log(`[ERROR] ${message}. Trying again in ${timeout / 1000} second(s)`);
    setTimeout(func, timeout, ...args);
}

function getExchangeRate() {
    request.get({
        url: 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json', // Parsing the exchange rate using the National Bank of Ukraine API
        json: true
    }, (error, res, body) => {
        if (error || !body?.length) return retry(`${error} & ${JSON.stringify(body)} on getExchangeRate()`, config.DELAYS.ERROR, getExchangeRate)

        const rateData = body.find(rate => rate.cc === config.CURRENCY_CODE)
        if (!rateData.rate) return retry(`No exchange rate inside ${JSON.stringify(rateData)}`, config.DELAYS.ERROR, getExchangeRate)

        setTimeout(getExchangeRate, config.DELAYS.EXCHANGE_RATE);
        console.log((`[RATE] Updated exchange rate: ${data.exchangeRate} UAH/USD => ${rateData.rate} UAH/USD | ${new Date().toISOString()}`));
        data.exchangeRate = rateData.rate
        data.updatedAt = new Date().getTime()
    })
}

getExchangeRate()

module.exports = {
    get rate() { return data.exchangeRate }
}