const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

const config = require('./config')
const { exchange, database, email } = require('./helpers')

const app = express()
const server = http.createServer(app)

function processNotification() {
    if (!exchange.rate) return setTimeout(processNotification, config.DELAYS.ERROR); // in case exchange rate has not been parsed yet
    const lastNotification = database.getLastTimestamp()
    if (new Date() - lastNotification > config.DELAYS.EMAIL_NOTIFICATION) {
        const emails = database.getEmails()
        if (emails.length) {
            console.log('[EMAIL] More than a day has passed since the last notification email, sending a message right now');
            email.notifyMembers(exchange.rate, database.getEmails())
            database.updateTimestamp(new Date().getTime())
        } else console.log(`[EMAIL] No users have been added. Trying again tomorrow`);
        setTimeout(processNotification, config.DELAYS.EMAIL_NOTIFICATION);
    } else {
        const delay = lastNotification + config.DELAYS.EMAIL_NOTIFICATION - new Date()
        console.log(`[EMAIL] Notifying users in ${new Date(delay).toISOString().slice(11, 19)}`); // .toISOString().slice(11, 19) is used to skip tedious process of converting delay in ms into hours, minutes and seconds using division
        setTimeout(processNotification, delay);
    }
}

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/rate', (req, res) => {
    const exchangeRate = exchange.rate
    if (!exchangeRate) return res.status(400).end()
    
    res.json(exchangeRate)
})

app.post('/subscribe', (req, res) => {
    const email = req.body.email
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(409).json({ success: false, msg: `${email} is not an email` })
    if (database.getEmails().includes(email)) return res.status(409).json({ success: false, msg: `${email} has already been added to our database` })

    database.addEmail(email)
    res.json({ success: true, data: { email } })
})

server.listen(config.PORT, () => {
    console.log(`[START] Server started on port ${config.PORT} | ${new Date().toISOString()}`)
    processNotification() // Checking if we need to notify users by email
})