'use strict'

const options = {
    mailer: {
        template_path: './templates'
    },
    message: {
        default_from: 'No-reply <no-reply@local.dev>'
    } 
}

const cid = 'rick_morty_img'
const email = require('../index').getMailer(options)
const message = email
    .template('simple')
    .to('contact@local.dev')
    .subject('Mon super email avec pièce jointe')
    .attachment('./assets/img_1.png', 'Rick_Morty.png', { cid })
    .params({
        title: 'Mon super titre',
        content: 'Mon super message avec pièce jointe !',
        cid
    })

message.send()
    .then(_ => console.log('Email sended'))
    .catch(console.error)