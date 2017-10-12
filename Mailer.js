'use strict';

const fs = require('fs');
const nodemailer = require('nodemailer');
const renderer = require('ejs');
const Message = require('./Message');

/**
 * @constant MAILER_DEFAULTS
 */
const MAILER_DEFAULTS = {
    template_path: './Templates',
    TRANSPORT_PROTOCOL: 'SMTP',
    TRANSPORT_OPTIONS: {
        connectionTimeout: 30 * 1000,
        pool: false,
        host: 'localhost',
        port: '1025'
    }
};

/**
 * @constant MAILER_OPTIONS
 */
const MAILER_OPTIONS = {
    template_extension: '.ejs',
    text_extension: '.txt',
    transporter: null
};

const MESSAGES_OPTIONS = {
    email_regexp: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    default_from: 'no-reply@localhost.local',
    default_cc: ''
};

/**
 * @class Mailer
 * @description Fluent mailer
 */
class Mailer {

    /**
     * @description Mailer class constructor
     * @param {String} template_path path to mails templates
     * @param {Object} options mailer options
     * @property {Object} Mailer._transporter Email transporter
     */
    constructor (
        template_path = MAILER_DEFAULTS.template_path,
        options = {}
    ) {
        /**
         * @type {String}
         * @description Templates path
         * @public
         */
        this.template_path = template_path;

        /**
         * @type {Object}
         * @description Mailer options
         * @public
         */
        this.options = Object.assign({}, MAILER_OPTIONS, options);

        /**
         * @type {Object|null}
         * @description Mail transporter
         * @private
         */
        this._transporter = null;

        this._createTransporter();
    }

    /**
     * @description Create Message instance
     * @param {Object} options
     * @returns [Message] Message instance
     * @throws {Error} if Message instanciation throws error(s)
     * @public
     */
    createMessage(options = {}) {
        options = Object.assign({}, MESSAGES_OPTIONS, options);
        try {
            return new Message(this, options);
        } catch (err) {
            throw new Error(`Mailer::createMessage - ${err}`);
        }
    }

    /**
     * @description Get mail transport
     * @returns {Object|null}
     * @throws {Error} if missing mail transport
     * @protected
     */
    getTransport () {
        if (!this._transporter) throw new Error('Mailer::getTransport - Missing mail transport');
        return this._transporter;
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
            return this._readFile(template, context, this.options.template_extension);
        } catch (err) {
            throw new Error(`Mailer::_renderHTML error - ${err}`);
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
            return this._readFile(template, context, this.options.text_extension, optional);
        } catch (err) {
            throw new Error(`Mailer::_renderText error - ${err}`);
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
            const file = fs.readFileSync(this.template_path + '/' + template + extension, 'utf8');
            return renderer.render(file, context);
        } catch (err) {
            if (optional === false) throw new Error(`Mailer::renderHTML - ReadFile error - ${err}`);
        }
        return null;
    }

    /**
     * @description Create mailer transporter
     // * @param transporter mailer transporter
     * @requires nodemailer
     * @throws {Error} if email transport creation throws error(s)
     * @protected
     */
    _createTransporter () {
        if (!this._transporter) {
            if (this.options.transporter !== null) this._transporter = this.options.transporter;
            else {
                try {
                    const createTransport = nodemailer.createTransport;
                    this._transporter = createTransport(
                        this.options.protocol || MAILER_DEFAULTS.TRANSPORT_PROTOCOL,
                        this.options.transport || MAILER_DEFAULTS.TRANSPORT_OPTIONS
                    );
                } catch (err) {
                    throw new Error(`Mailer::_createTransporter - Error on transport creation - ${err}`);
                }
            }
        }
    }

}

module.exports = Mailer;