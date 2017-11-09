'use strict'

const _ = require('lodash')
const Attachment = require('./Attachment')

/**
 * @constant MESSAGES_OPTIONS
 */
const MESSAGES_OPTIONS = {
    email_regexp: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    default_from: 'no-reply@local.dev',
    default_cc: ''
}

/**
 * @class Message
 * @description Represents an email message
 */
class Message {

    /**
     * @description Message constructor
     * @param {Mailer} mailer
     * @param {Object} options
     * @property {String} Mailer._template_name template name
     * @property {Array} Mailer._from Emitter email addresses
     * @property {Array} Mailer._to Receiver email addresses
     * @property {Array} Mailer._cc Copy Carbon email addresses
     * @property {Array} Mailer._bcc Blind Copy Carbon email addresses
     * @property {Object} Mailer._context Email context
     * @property {Object} Mailer._attachments Email attachments
     * @property {Object} Mailer._headers Email headers
     * @property {String} Mailer._subject Email subject
     */
    constructor (mailer, options = {}) {
        /**
         * @type [Mailer]
         * @description Mailer instance
         * @public
         */
        this.mailer = mailer

        /**
         * @type {Object}
         * @description Message options
         * @public
         */
        this.options = Object.assign({}, MESSAGES_OPTIONS, options)

        /**
         * @type {String}
         * @description Email template name
         * @private
         */
        this._template_name = ''

        /**
         * @type {Array}
         * @description Email From addresses list
         * @private
         */
        this._from = []

        /**
         * @type {Array}
         * @description Email To addresses list
         * @private
         */
        this._to = []

        /**
         * @type {Array}
         * @description Email Copy Carbon addresses list
         * @private
         */
        this._cc = []

        /**
         * @type {Array}
         * @description Email Blind Copy Carbon addresses list
         * @private
         */
        this._bcc = []

        /**
         * @type {Object}
         * @description Email contest
         * @private
         */
        this._context = {}

        /**
         * @type {Array}
         * @description Email attachments list
         * @private
         */
        this._attachments = []

        /**
         * @type {Object}
         * @description Email headers
         * @private
         */
        this._headers = {}

        /**
         * @type {String}
         * @description Email subject
         * @private
         */
        this._subject = ''
    }

    /**
     * @description Append emitter email(s) to list
     * @param value
     * @returns {Message}
     */
    from (...value) {
        this._alterProp('_from', value)
        return this
    }

    /**
     * @description Append receiver email(s)
     * @param value
     * @returns {Message}
     */
    to (...value) {
        this._alterProp('_to', value)
        return this
    }

    /**
     * @description Append CC email(s) to list
     * @param value
     * @returns {Message}
     */
    cc (...value) {
        this._alterProp('_cc', value)
        return this
    }

    /**
     * @description Append BCC email(s) to list
     * @param value
     * @returns {Message}
     */
    bcc (...value) {
        this._alterProp('_bcc', value)
        return this
    }

    /**
     * @description Define template
     * @param template
     * @returns {Message}
     */
    template (template) {
        if (
            template
            && template.constructor === String
            && template.length
        ) this._template_name = template
        return this
    }

    /**
     * @description Add email subject
     * @param {String} subject
     * @returns {Message}
     * @public
     */
    subject (subject) {
        if (
            subject
            && subject.constructor === String
            && subject.length
        ) this._subject = subject
        return this
    }

    /**
     * @description Add email attachments
     * @param {Object[]} items Attachments list (array of objects)
     * @returns {Message}
     * @public
     */
    attachments (items = []) {
        if (Array.isArray(items) && items.length)
            items.forEach(...args => this.attachment(...args))
        return this
    }

    /**
     * @description Add email single attachment
     * @param {String} content
     * @param {String} name
     * @param {Object} options
     * @returns {Message}
     * @requires Attachment class
     * @throws {Error} if attachment content is not defined
     * @public
     */
    attachment (content, name = null, options = {}) {
        if (!content || !content.length) throw new Error('Message::attachment - Attachment content is not defined or empty')
        try {
            const attachment = new Attachment(content, name, options)
            this._attachments.push(attachment)
        } catch (err) {
            throw new Error(`Message::attachment - Attachment class instanciation error - ${err}`)
        }
        return this
    }

    /**
     * @description Add template params
     * @param {Object} context
     * @returns {Message}
     */
    params (context = {}) {
        this._context = Object.assign({}, this._context, context)
        return this
    }

    /**
     * @description Append param to template params
     * @param {String} key param key
     * @param value param value
     * @returns {Message}
     */
    param (key, value) {
        this._context[key] = value
        return this
    }

    /**
     * @description Return mail params
     * @returns {{from: (Array), to: (Array), cc: (Array), bcc: (Array), subject: String, html: String, text: (String|null), attachments: Array, headers: Array}}
     */
    getMessage () {
        this._normalizeEmails()
        return {
            from: this._from,
            to: this._to,
            cc: this._cc,
            bcc: this._bcc,
            subject: this._subject,
            html: this.mailer._renderHTML(this._template_name, this._context),
            text: this.mailer._renderText(this._template_name, this._context, true),
            attachments: this._attachments,
            headers: Object.assign({}, this._headers, {subject: this._subject})
        }
    }

    /**
     * @description Send email
     * @param {String|null} template message template
     * @param {Object} context message context
     * @param {Function|undefined} callback send callback function
     * @returns {Promise|undefined} Promise instance or undefined if callback parameter is defined
     * @throws {Error} throw error if template is not defined
     * @throws {Error} throw error if subject is not defined
     * @throws {Error} if transporter is not defined
     */
    send (template = null, context = {}, callback) {
        if (
            template !== null 
            && template.constructor === Function
        ) {
            callback = template;
            template = null;
            context = {};
        }
        if (context.constructor === Function) {
            callback = context;
            context = {};
        }

        this.template(template)
        this.params(context)
        if (!this._hasTemplate()) throw new Error('Message::send - Missing email template')
        if (!this._hasSubject()) throw new Error('Message::send - Missing email subject')

        if (callback) this.mailer.getTransport().sendMail(this.getMessage(), callback)
        else {
            return new Promise((resolve, reject) => {
                try {
                    this.mailer.getTransport().sendMail(this.getMessage(), err => {
                        if (err) reject(err)
                        else resolve()
                    })
                } catch (err) {
                    throw new Error(`Message::send - Error - ${err}`)
                }
            })
        }
    }

    /**
     * @description Send email and close transport (only with promises)
     * @inheritdoc
     */
    sendAndClose (template = null, context = {}) {
        return this.send(template, context)
            .then(_ => this.mailer.getTransport().close())
    }

    /**
     * @description Normalize emails (check format, remove duplicates)
     * @private
     */
    _normalizeEmails () {
        if (!this._from.length) this.from(this.options.default_from)
        this._validateList('_from')
        if (!this._from.length) throw new Error('Message::from - You must define at least one emitter email address')

        this._validateList('_to')
        if (!this._to.length) throw new Error('Message::to - You must define at least one receiver email address')

        if (!this._cc.length) this.cc(this.options.default_cc)
        this._validateList('_cc')

        this._validateList('_bcc')
    }

    /**
     * @description Normalize email address (check format)
     * @param {String|null} email
     * @returns {Boolean} Normalized email address
     * @throws new Error on Regexp error
     * @private
     */
    _normalizeEmail (email = null) {
        if (!email) return null
        try {
            const {regexp} = this.options
            const re = new RegExp(regexp)
            return re.test(email)
        } catch (err) {
            console.error(new Error('Message::_normalizeEmail - Regexp test error = ${err}'))
            return false
        }
    }

    /**
     * @description Validate list
     * @param {String} key
     * @requires lodash
     * @private
     */
    _validateList (key) {
        if (key && this[key] && this[key].length) {
            this[key] = _
                .chain(this[key])
                .filter(item => this._normalizeEmail(item) !== null)
                .uniq()
                .value()
        }
    }

    /**
     * @description Set/Alter instance property
     * @param key
     * @param value
     * @private
     */
    _alterProp (key, ...value) {
        if (value && value.length) {
            if (Array.isArray(value[0])) value = value[0]
            if (this[key]) this[key].push(...value)
        }
    }

    /**
     * @description Check if email template is defined
     * @returns {boolean}
     * @private
     */
    _hasTemplate () {
        return this._check('_template_name', 'string')
    }

    /**
     * @description Check if email subject is defined
     * @returns {boolean}
     * @private
     */
    _hasSubject () {
        return this._check('_subject', 'string')
    }

    /**
     * @description Check key
     * @param key
     * @param type key type to check (ex. string)
     * @returns {boolean}
     * @private
     */
    _check (key, type = 'string') {
        if (!key || !this[key]) return false
        const item = this[key]
        let check = item !== null
        if (this[key].hasOwnProperty('length')) check = check && item.length
        if (type) check = check && typeof item === type
        return Boolean(check)
    }

}

module.exports = Message