# Mailr
## A fluent mail library for NodeJS based on [Nodemailer](https://github.com/nodemailer/nodemailer)

The goal of Mailr is simple : send fluent emails with NodeJS.

<br>

### Basic example (with EJS templating) :
#### NodeJS :
```JS
const Mailr = require('Mailr')
const options = {
    mailer: {
        template_path: './templates'
    },
    message: {
        default_from: 'No-reply <no-reply@local.dev>'
    } 
}

Mailr
    .getMailer(options)
    .template('simple')
    .to('contact@local.dev')
    .subject('Mailr is awesome !')
    .params({
        title: 'Donec sollicitudin molestie malesuada',
        content: 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Sed porttitor lectus nibh.'
    })
    .send()
    .then(_ => console.log('Email sended'))
    .catch(console.error)
``` 
#### Template EJS :
```HTML
<html>
    <head>
        <meta charset="utf8">
    </head>
    <body>
        <h1><%= title %></h1>
        <p><%= content %></p>
    </body>
</html>
```
