'use strict'

class Renderer {

  constructor () {
    this._name = null
    this._module_name = null
    this._module = null
  }
  
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