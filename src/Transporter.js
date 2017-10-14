'use strict'

const createTransport = require('nodemailer').createTransport

const TRANSPORTER_OPTIONS = {
    connectionTimeout: 30 * 1000,
    pool: false,
    secure: false,
    host: 'localhost',
    ignoreTLS: true,
    port: 1025,
    logger: false,
    debug: false
}

class Transporter {

    constructor (options = {}) {
        this.options = Object.assign({}, TRANSPORTER_OPTIONS, options)

        this._transport = null

        this._createSMTPTransport()
    }

    getTransport () {
        return this._transport
    }

    /**
     * @description Create mailer SMTP transport
     * @requires nodemailer
     * @throws {Error} if email transport creation throws error(s)
     * @protected
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