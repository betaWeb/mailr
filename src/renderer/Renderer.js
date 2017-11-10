'use strict'

/**
 * @class Renderer
 * @description Email template renderer class
 */
class Renderer {

  /**
    * @property {String} Renderer._name Renderer name
    * @property {String} Renderer._module_name Rendere node module name
    * @property {Object} Renderer._module Instance of renderer module 
   */
  constructor () {
    this._name = null
    this._module_name = null
    this._module = null
  }

  /**
   * @description Init Renderer
   * @return {Renderer} The renderer instance
   * @public
   */
  init () {
    this._loadModule()
    return this
  }

  /**
   * @description Render template
   * @return {null}
   * @public
   */
  render (tpl, context = {}) {
    return null
  }
  
    /**
     * @description Load node module via _module_name property
     * @throws Error if node module is not defined or if require throws an exception
     * @private
     */
  _loadModule () {
    if (!this._module_name) throw new Error("Renderer::_loadModule - No module defined !")
      try {
          this._module = require(this._module_name)
      } catch (err) {
          throw new Error(`Renderer::_loadModule - Require "${this._module_name}" module error - ${err}`)
      }
  }

}

module.exports = Renderer