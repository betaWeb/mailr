# Mailr
## A fluent mail library for NodeJS based on [Nodemailer](https://github.com/nodemailer/nodemailer)

The goal of Mailr is simple : create and send emails by fluent-way with NodeJS.

<br>

### Basic example :
#### NodeJS :
```javascript
const Mailr = require('Mailr')

// Example with Gmail SMTP service
const mailr = new Mailr({
    transporter_options: {
        service: 'gmail',
        port: 465,
        secure: true,
        host: 'smtp.gmail.com',
        auth: {
            user: 'email.address@gmail.com', // Here your Gmail address
            pass: 'mysecurepassword'         // Here your Gmail password
        }
    }
})

mailr
    .createMessage()
    .from('no-reply@local.dev')
    .to('receiver@domain.com')
    .subject('Mailr is awesome !')
    .template('my_awesome_template.njk')
    .params({
        title: 'Mail sended with Mailr',
        content: 'This email has been sended with Mailr lib, and it "roxx du poney" !'
    })
    .send()
    .then(_ => console.log('Email sended'))
    .catch(console.error)
``` 
#### Template (with [Nunjucks](https://mozilla.github.io/nunjucks/) by default) :
```HTML
<html>
    <head>
        <meta charset="utf8">
    </head>
    <body>
        <h1>{{ title }}</h1>
        <p>{{ content }}</p>
    </body>
</html>
```


### Example with attachment :
#### NodeJS :
```javascript
const options = {
    mailer: {
        template_path: './templates',
        transporter_options: {
            service: 'gmail',
            port: 465,
            secure: true,
            host: 'smtp.gmail.com',
            auth: {
                user: 'email.address@gmail.com', // Here your Gmail address
                pass: 'mysecurepassword'         // Here your Gmail password
            }
        }
    },
    message: {
        default_from: 'No-reply <no-reply@local.dev>'
    } 
}

const email = new Mailr(options).createMessage()
const message = email
    .template('tpl_name')
    .to('contact@local.dev')
    .subject('My awesome email with attachment')
    .attachment(
        'path/to/attachment.pdf',           // Path to attachment file
        'My PDF file',                      // Attachment name
        { contentType: 'application/pdf' }  // Attachment options
    )
    .params({
        title: 'This PDF file rocks !',
        content: 'Look at this awesome attachment dude !'
    })

message.send()
    .then(_ => console.log('Email sended with attachment'))
    .catch(console.error)
```