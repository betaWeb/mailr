# Mailr
## A fluent mail library for NodeJS based on [Nodemailer](https://github.com/nodemailer/nodemailer)

The goal of Mailr is simple : create and send emails by fluent-way with NodeJS.

<br>

### Basic example :
#### NodeJS :
```javascript
const Mailr = require('Mailr')
const mailr = new Mailr({
    template_path: './templates',
    renderer: 'Nunjucks'
})

mailr
    .createMessage()
    .from('no-reply@local.dev')
    .to('contact@local.dev')
    .subject('Mailr is awesome !')
    .template('tpl_name')
    .params({
        title: 'Donec sollicitudin molestie malesuada',
        content: 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Sed porttitor lectus nibh.'
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
```JS
const options = {
    mailer: {
        template_path: './templates'
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
        title: 'Mon super titre',
        content: 'Mon super message avec pièce jointe !'
    })

message.send()
    .then(_ => console.log('Email sended with attachment'))
    .catch(console.error)
```