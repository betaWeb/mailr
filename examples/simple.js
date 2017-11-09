'use strict'

const Mailr = require('../index')
const mailr = new Mailr({ template_path: './templates' })

mailr.createMessage()
    .template('simple')
    .to('contact@local.dev')
    .subject('Mon super email')
    .params({
        title: 'Mon super titre',
        content: 'Mon super message !'
    })
    .send()
    .then(_ => console.log('Email sended'))
    .catch(console.error)