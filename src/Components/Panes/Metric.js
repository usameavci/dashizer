import merge from 'lodash/merge'
import Xhr from '../../Sources/Xhr'

import Text from './Text'

export default class Metric extends Text {
  constructor (conf) {
    const defaults = {
      classNames: {
        pane: 'dashizer-pane__metric',
        up: 'dashizer-pane__up',
        down: 'dashizer-pane__down'
      },
      fitText: true
    }

    conf = merge({}, defaults, conf)

    super(conf)

    return this
  }

  handlerValueChanged (value, source) {
    this.setContentData(this.dom, value)

    if (source instanceof Xhr && source.getTimeout() < 3000) return

    const lastValue = source.getLastValue()
    const isUp = parseFloat(value) > parseFloat(lastValue)
    const isDown = parseFloat(value) < parseFloat(lastValue)
    const domClasses = this.dom.pane.classList
    const classUp = this.conf.classNames.up
    const classDown = this.conf.classNames.down
    const classChanged = this.conf.classNames.changed

    domClasses.toggle(classUp, isUp)
    domClasses.toggle(classDown, isDown)
    domClasses.add(classChanged)

    setTimeout(() => {
      domClasses.remove(classUp, classDown, classChanged)
    }, 3 * 1000)
  }
}
