'use strict'

const fs = require('fs')
const path = require('path')
const Transporter = require('./Transporter')
const Message = require('./Message')

/**
 * @constant MAILER_OPTIONS
 */
const MAILER_OPTIONS = {
    template_path: './templates',
    template_renderer: 'ejs',
    template_extension: '.ejs',
    text_extension: '.txt',
    transporter_options: {}
}

const MESSAGES_OPTIONS = {
    email_regexp: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    default_from: 'no-reply@localhost.local',
    default_cc: ''
}

/**
 * @class Mailer
 * @description Fluent mailer
 */
class Mailer {

    /**
     * @description Mailer class constructor
     * @param {Transporter|null} transporter mailer transport
     * @param {Object} options mailer options
     * @property {Transporter} Mailer.transporter Transporter instance
     * @property {Object} Mailer.options Mailer options
     * @property {Object} Mailer._renderer Templates renderer library
     */
    constructor (
        transporter = null,
        options = {}
    ) {
        /**
         * @type {Object|null}
         * @description Mail transporter
         * @private
         */
        this.transporter = transporter

        /**
         * @type {Object}
         * @description Mailer options
         * @public
         */
        this.options = Object.assign({}, MAILER_OPTIONS, options)

        this._renderer = null
        
        this._createTransport()
        this._getRenderer()
    }

    static getMailer (options = {}) {
        const mailer = new this(null, options.mailer || {})
        return mailer.createMessage(options.message || {})
    }

    /**
     * @description Create Message instance
     * @param {Object} options
     * @returns [Message] Message instance
     * @throws {Error} if Message instanciation throws error(s)
     * @public
     */
    createMessage(options = {}) {
        options = Object.assign({}, MESSAGES_OPTIONS, options)
        try {
            return new Message(this, options)
        } catch (err) {
            throw new Error(`Mailer::createMessage - ${err}`)
        }
    }

    /**
     * @description Get mail transport
     * @returns {Object|null}
     * @throws {Error} if missing mail transport
     * @protected
     */
    getTransport () {
        if (!this.transporter) throw new Error('Mailer::getTransport - Missing mail transport')
        return this.transporter
    }

    /**
     * @description Render HTML template
     * @param {String} template path to HTML template relative to template_path property
     * @param {Object} context Email context
     * @return {String} Rendered mail template in HTML
     * @protected
     */
    _renderHTML (template, context = {}) {
        try {
            return this._readFile(template, context, this.options.template_extension)
        } catch (err) {
            throw new Error(`Mailer::_renderHTML error - ${err}`)
        }
    }

    /**
     * @description Render text template
     * @param {String} template template path to text template relative to template_path property
     * @param {Object} context Email context
     * @param {Boolean} optional Template render is optional - Default: false
     * @returns {String} rendered text file
     * @protected
     */
    _renderText (template, context = {}, optional = true) {
        try {
            return this._readFile(template, context, this.options.text_extension, optional)
        } catch (err) {
            throw new Error(`Mailer::_renderText error - ${err}`)
        }
    }

    /**
     * @description Read file content
     * @param {String} template
     * @param {Object} context
     * @param {String} extension
     * @param {Boolean} optional
     * @returns {String}
     * @requires fs
     * @requires ejs renderer
     * @private
     * @throws Error
     */
    _readFile (template, context, extension, optional = false) {
        try {
            const folder_path = this.options.template_path + path.sep
            const file_path = `${path.basename(folder_path + template, extension)}${extension}`
            const file = fs.readFileSync(folder_path + file_path, 'utf8')
            return this._renderer.render(file, context)
        } catch (err) {
            if (optional === false) throw new Error(`Mailer::renderHTML - ReadFile error - ${err}`)
        }
        return null
    }

    /**
     * @description Create mailer SMTP transport
     * @throws {Error} if email transport creation throws error(s)
     * @protected
     */
    _createTransport () {
        if (this.transporter !== null) return
        this.transporter = new Transporter(this.options.transporter_options).getTransport()
    }

    _getRenderer () {
        const renderer = this.options.template_renderer
        if (!renderer) throw new Error("Mailer::_getRenderer - No renderer defined !")
        else if (renderer.constructor === String) {
            try {
                this._renderer = require(renderer)
            } catch (err) {
                throw new Error(`Mailer::_getRenderer - Require renderer module error - ${err}`)
            }
        } else this._renderer = renderer
    }

}

module.exports = Mailer