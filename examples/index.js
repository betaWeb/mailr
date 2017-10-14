'use strict'

const options = {
    mailer: {
        template_path: './templates'
    },
    message: {
        default_from: 'contact@local.dev'
    } 
}
const message = require('../src/Mailer').getMailer(options)
message
    .template('simple')
    .to('cyprien.glepin@gmail.com')
    .subject('Mon super email')
    .params({
        title: 'Mon super titre',
        content: 'Mon super message !'
    })
    .send()