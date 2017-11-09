'use strict'

const fs = require('fs')
const path = require('path')
const Transporter = require('./Transporter')
const Message = require('./Message')
const Renderer = require('./renderer/Renderer')

/**
 * @constant MAILER_OPTIONS
 */
const MAILER_OPTIONS = {
    template_path: './templates',
    renderer: 'Nunjucks',
    template_extension: '.njk',
    text_extension: '.txt',
    transporter_options: {}
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
        if (
            transporter !== null 
            && transporter.constructor === Object
        ) {
            options = transporter
            transporter = null
        }

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
        
        /**
         * @type {Object}
         * @description Renderer instance
         * @private
         */
        this._renderer = null
        
        try {
            this._createTransport()
        } catch (err) {
            throw new Error(`Mailer::constructor - 'Mailer._createTransport' method call Error - ${err}`)
        }

        try {
            this._getRenderer()
        } catch (err) {
            throw new Error(`Mailer::constructor - 'Mailer._getRenderer' method call Error - ${err}`)            
        }
    }

    /**
     * @description Get Mailer instance and create Message instance
     * @param {Object} options
     * @returns [Message] Message instance
     * @throws {Error} if method throws error(s)
     * @static
     * @public
     */
    static getMailer (options = {}) {
        try {
            const mailer = new this(null, options.mailer || {})
            return mailer.createMessage(options.message || {})
        } catch (err) {
            throw new Error(`Mailer::getMailer - ${err}`)
        }
    }

    /**
     * @description Get Renderer class
     * @returns [Renderer] Renderer object
     * @static
     * @public
     */
    static get Renderer () {
        return Renderer
    }

    /**
     * @description Create Message instance
     * @param {Object} options
     * @returns [Message] Message instance
     * @throws {Error} if Message instanciation throws error(s)
     * @public
     */
    createMessage(options = {}) {
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
     * @description Set mail transport
     * @returns {Mailer} Mailer instance
     * @protected
     */
    setTransport (transporter) {
        if (!transporter instanceof Transporter) throw new Error('Mailer::setTransport - transporter parameter must be a valid instance of class Transporter')
        this.transporter = transporter
        return this
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
     * @private
     * @throws Error
     */
    _readFile (template, context, extension, optional = false) {
        try {
            const folder_path = this.options.template_path + path.sep
            const file_path = `${path.basename(folder_path + template, extension)}${extension}`
            const tpl = path.resolve(folder_path + file_path)
            return this._renderer.render(tpl, context)
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
        if (this.transporter !== null && this.transporter instanceof Transporter) return
        this.transporter = new Transporter(this.options.transporter_options).transport
    }

    /**
     * @description Create and get a template renderer
     * @throws {Error} if renderer creation throws error(s)
     * @protected
     */
    _getRenderer () {
        let Renderer = null
        let module_name = this.options.renderer || null

        if (!module_name) module_name = 'Nunjucks'

        try {
            if (module_name.constructor === String) {
                try {
                    fs.lstatSync(module_name).isFile()
                    Renderer = require(module_name)
                } catch (err) {
                    Renderer = require(`./renderer/${module_name}Renderer`)
                }
                this._renderer = new Renderer()
            } else this._renderer = module_name
        } catch (err) {
            throw new Error(`Mailer::_getRenderer - Create '${module_name}Renderer' error - ${err}`)
        }

        if (!this._renderer.render)
            throw new Error(`Mailer::_getRenderer - '${module_name}Renderer' must have a 'render' method`)
    }

}

module.exports = Mailer