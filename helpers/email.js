const config = require('../config')
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL.username,
        pass: config.EMAIL.password,
    }
});

module.exports = {
    notifyMembers: (exchangeRate, members) => {
        const now = new Date()
        const mailOptions = {
            from: `"Genesis Engineering School 4.0 Bot" <${config.EMAIL.username}>`,
            to: members.join(', '),
            subject: `USD/UAH exchange rate - ${now.toLocaleDateString('uk-UA')}`,
            html: `<h1>Обмінний курс USD/UAH</h1><p>Обмінний курс дорівнює ${exchangeRate} USD/UAH (станом на ${now.toLocaleTimeString('uk-UA')} ${now.toLocaleDateString('uk-UA')})</p><p>Дякуємо за те, що вибрали наш сервіс, і бажаємо хорошого дня!</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return console.log(`[ERROR] ${error} on notifyMembers()`)

            console.log(`[EMAIL] Message sent to ${info.accepted.join(', ')}`);
        })
    }
}