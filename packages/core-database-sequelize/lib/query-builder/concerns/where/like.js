const isObject = require('../../utils/is-object')
const map = require('./utils/map')

module.exports = class WhereConcern {
  static apply () {
    const args = arguments[0]

    const transform = (condition) => map(args[0], 'LIKE', `%${args[1]}%`)

    return isObject(args[0])
      ? args[0].map(arg => transform(arg))
      : transform(args)
  }
}
