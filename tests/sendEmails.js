const fs = require('fs')

// This program will not send any emails!
// It is used to remove all previous timestamps
// So on the next launch server would think there were no previous mailings
// And it will be forced to send new emails

const path = '../database/notifications.txt'

if (fs.existsSync('path')) fs.unlinkSync('path')