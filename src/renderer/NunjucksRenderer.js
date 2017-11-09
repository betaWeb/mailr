'use strict'

const Renderer = require('./Renderer')

class NunjucksRenderer extends Renderer {

  constructor () {
    super()
    this._name = 'Nunjucks'
    this._module_name = 'nunjucks'
    this._loadModule()
  }

  render (tpl, context) {
    return this._module.render(tpl, context)
  }

}

module.exports = NunjucksRenderer