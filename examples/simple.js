'use strict'

const options = {
    mailer: {
        template_path: './templates'
    },
    message: {
        default_from: 'No-reply <no-reply@local.dev>'
    } 
}
const email = require('../index').getMailer(options)
const message = email
    .template('simple')
    .to('contact@local.dev')
    .subject('Mon super email')
    .params({
        title: 'Mon super titre',
        content: 'Mon super message !'
    })

message.send()
    .then(_ => console.log('Email sended'))
    .catch(console.error)