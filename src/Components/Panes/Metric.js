import merge from 'lodash/merge'

import Text from './Text'

export default class Metric extends Text {
  constructor (conf) {
    const defaults = {
      classNames: {
        pane: 'dashizer-pane__metric'
      },
      fitText: true
    }

    conf = merge({}, defaults, conf)

    super(conf)

    return this
  }
}
