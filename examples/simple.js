'use strict'

const Mailr = require('../index')
const mailr = new Mailr({
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
})

mailr.createMessage()
    .template('simple')
    .to('receiver@domain.com')
    .subject('A simple email')
    .params({
        title: 'A great title',
        content: 'A kickass message !'
    })
    .send()
    .then(_ => console.log('Email sended'))
    .catch(console.error)