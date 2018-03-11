'use strict'

const options = {
    mailer: {
        template_path: './templates',
        transporter_options: {
            service: 'gmail',
            port: 465,
            secure: true,
            host: 'smtp.gmail.com',
            auth: {
                user: 'email.address@gmail.com',
                pass: 'mysecurepassword'
            }
        }
    },
    message: {
        default_from: 'No-reply <no-reply@local.dev>'
    } 
}

const cid = 'rick_morty_img'
const email = require('../index').getMailer(options)
const message = email
    .template('simple')
    .to('receiver@domain.com')
    .subject('My awesome email with attachment')
    .attachment('./assets/img_1.png', 'Rick_Morty.png', { cid, contentType: 'image/png' })
    .params({
        title: 'Rick and Morty roxx',
        content: 'Look at this awesome attachment dude !',
        cid
    })

message.send()
    .then(_ => console.log('Email sended'))
    .catch(console.error)