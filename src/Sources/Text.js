import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'

export default class Text {
  constructor (conf) {
    const defaults = {}

    this.conf = merge({}, defaults, conf)
    this.data = null
    this.lastValue = null
    this.events = {
      onValueChanged () {}
    }
  }

  clone () {
    return cloneDeep(this)
  }

  setData (data) {
    this.data = data
    this.events.onValueChanged(this.data, this)

    return this
  }

  getData () {
    return new Promise(resolve => {
      if (this.lastValue !== this.data) {
        this.events.onValueChanged(this.data, this)
        this.lastValue = this.data
      }

      resolve(this.data)
    })
  }

  getLastValue () {
    return this.lastValue
  }

  onValueChanged (cb) {
    if (!(cb instanceof Function)) throw Error('onValueChanged callback must be a function!')

    this.events.onValueChanged = cb

    return this
  }
}
