'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @constant ATTACHMENT_DEFAULTS
 */
const ATTACHMENT_DEFAULTS = {
    FILE_TYPE: 'local',
    ALLOWED_PROPERTIES: [
        'filename',
        'content',
        'path',
        'href',
        'contentType',
        'contentDisposition',
        'cid',
        'encoding',
        'headers',
        'raw'
    ]
};

/**
 * @constant ATTACHMENT_OPTIONS
 */
const ATTACHMENT_OPTIONS = {
    STREAM_OPTIONS: 'utf8'
};

/**
 * @class Attachment
 * @description Represents an attachment entity
 */
class Attachment {

    /**
     * @description Attachment class constructor
     * @param {String|*} path - Attachment path or content
     * @param {String|null} name - Attachment name
     * @param {Object} options - Attachment options
     * @param {Object} headers - Attachment headers
     * @returns {Object} Attachment options object
     */
    constructor(
        path,
        name = null,
        options = {},
        headers = {}
    ) {
        /**
         * @description Attachment path
         * @public
         */
        this.path = path;

        /**
         * @description Attachment name
         * @public
         */
        this.name = name;

        /**
         * @description Attachment options
         * @public
         */
        this.options = Object.assign({}, ATTACHMENT_OPTIONS, options);

        /**
         * @description Attachment headers
         * @public
         */
        this.headers = headers;

        /**
         * @description Attachment properties
         * @private
         */
        this._attachment = {};

        /**
         * @description Attachment file type
         * @private
         */
        this._file_type = this.options.type || ATTACHMENT_DEFAULTS.FILE_TYPE;

        return this._getProperties();
    }

    /**
     * @description Construct and returns an object for attachment properties
     * @returns {Object} Attachment object
     * @private
     */
    _getProperties () {
        if (this.options.raw) this._attachment.raw = this.options.raw;
        else {
            if (!this.path) throw new Error('Attachment::getProperty - Missing attachment content');
            if (this._file_type === 'local') {
                const path = this._checkPath();
                this._attachment.filePath = path;
                this._attachment.path = path;
            }
            else if (this._file_type === 'stream') {
                const path = this._checkPath();
                this._attachment.content = fs.createReadStream(path, this.options.STREAM_OPTIONS);
                this._attachment.filePath = path;
            }
            else if (this._file_type === 'string') this._attachment.content = this.path;
            else if (this._file_type === 'href') this._attachment.href = this.path;

            if (
                !this.name
                || this.name.constructor !== String
                || !this.name.length
            ) {
                this._setNameByPath();
            }

            this._attachment.filename = this.name;
        }
        this._mergeProperties();
        return this._attachment;
    }

    /**
     * @description Merge Attachment object with options
     * @private
     */
    _mergeProperties () {
        if (this.options && Object.keys(this.options).length) {
            const allowed = Attachment.allowedProperties();
            for (let option in this.options) {
                if (this.options.hasOwnProperty(option)) {
                    if (allowed.includes(option) && !this._attachment[option])
                        this._attachment[option] = this.options[option];
                }
            }
        }
    }

    /**
     * @description Check if file exists
     * @returns {String|*}
     * @throws {Error} when file error
     * @requires fs
     * @private
     */
    _checkPath () {
        try {
            fs.readFileSync(this.path);
            return this.path;
        } catch (err) {
            throw new Error(`Attachment::_checkPath  - ${err}`);
        }
    }

    /**
     * @description Set attachment name if name property is not set
     * @throws {Error} if file parse throws an error
     * @requires path
     * @private
     */
    _setNameByPath () {
        try {
            const info = path.parse(this.path);
            if (info && Object.keys(info).length && info.base) this.name = info.base;
        } catch (err) {
            throw new Error(`Attachment::_setNameByPath - Get file info error - ${err}`);
        }
    }

    /**
     * @description Get allowed properties on attachment object
     * @returns {Array}
     */
    static allowedProperties () {
        return ATTACHMENT_DEFAULTS.ALLOWED_PROPERTIES;
    }

}

module.exports = Attachment;