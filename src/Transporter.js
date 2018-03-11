'use strict'

const createTransport = require('nodemailer').createTransport

/**
 * @constant TRANSPORTER_OPTIONS
 */
const TRANSPORTER_OPTIONS = {
    connectionTimeout: 30 * 1000,
    pool: false,
    secure: false,
    host: 'localhost',
    ignoreTLS: true,
    port: 1025,
    logger: false,
    debug: true
}

/**
 * @class Transporter
 * @description Mailr transport class
 */
class Transporter {

    /**
     * @description Transporter class constructor
     * @param {Object} options mailer options
     * @property {Object} Mailer.options Transporter options
     * @property {Transporter} Mailer._transport Mail transport instance
     */
    constructor (options = {}) {
        this.options = Object.assign({}, TRANSPORTER_OPTIONS, options)

        this._transport = null

        this._createSMTPTransport()
    }

    /**
     * @description Get Transporter _transport property
     * @returns {Object|null}
     * @public
     */
    get transport () {
        return this._transport
    }

    /**
     * @description Create mailer SMTP transport
     * @requires nodemailer
     * @throws {Error} if email transport creation throws error(s)
     * @private
     */
    _createSMTPTransport () {
        try {
            this._transport = createTransport(this.options)
        } catch (err) {
            throw new Error(`Transporter::_createSMTPTransport - Error on transport creation - ${err}`)
        }
    }

}

module.exports = Transporter