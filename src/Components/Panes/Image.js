import merge from 'lodash/merge'

import Text from './Text'

export default class Image extends Text {
  constructor (conf) {
    const defaults = {
      classNames: {
        pane: 'dashizer-pane__image'
      },
      height: 64,
      width: 'auto'
    }

    conf = merge({}, defaults, conf)

    super(conf)

    return this
  }

  renderContent () {
    const dom = document.createElement('div')
    dom.classList.add(this.conf.classNames.content)

    const domImage = document.createElement('img')

    dom.append(domImage)

    return dom
  }

  setContentData (dom, value) {
    const domImage = dom.content.querySelector('img')

    domImage.setAttribute('src', value)
    domImage.setAttribute('height', this.conf.height)
    domImage.setAttribute('width', this.conf.width)

    return this
  }
}
