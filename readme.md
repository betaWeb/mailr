# Mailr
## A fluent mail library for NodeJS based on [Nodemailer](https://github.com/nodemailer/nodemailer)

The goal of Mailr is simple : create and send emails by fluent-way with NodeJS.

<br>

### Basic example :
#### NodeJS :
```JS
const Mailr = require('Mailr')
const mailr = new Mailr({
    template_path: './templates',
    renderer_module_name: require('nunjucks')
})

mailr
    .createMessage()
    .from('no-reply@local.dev')
    .to('contact@local.dev')
    .subject('Mailr is awesome !')
    .template('simple')
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