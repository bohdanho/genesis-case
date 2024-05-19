const fs = require('fs')
const path = require('path')

const prefs = { encoding: 'utf-8' }
const filenames = {
    folder: 'database',
    emails: 'emails.txt',
    notifications: 'notifications.txt',
    get folderPath() { return path.join(__dirname, '..', this.folder) },
    get emailsPath() { return path.join(this.folderPath, this.emails) },
    get notificationsPath() { return path.join(this.folderPath, this.notifications) },
}

function makeDir(folderPath) {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
}

function readFile(filename) {
    return fs.existsSync(filename) ?
        fs.readFileSync(filename, prefs)
            .trim()
            .split(/[\r\n]+/) : [  ]
}

function appendToFile(filename, data) {
    const contents = [ ...readFile(filename), data ].filter(line => line) // Creating a new array of lines of the txt file from existings lines and a new one + checking whether there are any empty lines (in case the txt file was empty)
    fs.writeFileSync(filename, contents.join('\r\n'), prefs)
}

makeDir(filenames.folderPath)

module.exports = {
    addEmail: (email) => appendToFile(filenames.emailsPath, email),

    getEmails: () => readFile(filenames.emailsPath),

    updateTimestamp: (timestamp) => appendToFile(filenames.notificationsPath, timestamp),

    getLastTimestamp: () => parseInt(readFile(filenames.notificationsPath).pop()) || 0, // In case the txt file is empty and .pop() would result in undefined
}