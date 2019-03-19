import get from 'lodash/get'
import merge from 'lodash/merge'

import FitText from 'Utils/FitText'
import Xhr from 'Sources/Xhr'

export default class Text {
  constructor (conf) {
    const defaults = {
      columns: 3,
      rows: 3,
      classNames: {
        base: 'dashizer-pane',
        pane: 'dashizer-pane__text',
        footer: 'dashizer-pane-footer',
        title: 'dashizer-pane-title',
        subtitle: 'dashizer-pane-subtitle',
        content: 'dashizer-pane-content',
        up: 'dashizer-pane__up',
        down: 'dashizer-pane__down',
        changed: 'dashizer-pane__changed'
      },
      extraClasses: [],
      fitText: false
    }

    this.conf = merge({}, defaults, conf)
    this.dom = {}

    this.initialize()
  }

  initialize () {
    if (this.conf.source) {
      this.conf.source.onValueChanged((value, source) => {
        if (this.handlerValueChanged && !(this.handlerValueChanged instanceof Function)) {
          throw Error('handlerValueChanged callback must be a function!')
        }

        if (this.conf.onValueChanged && !(this.conf.onValueChanged instanceof Function)) {
          throw Error('onValueChanged callback must be a function!')
        }
        if (this.handlerValueChanged) this.handlerValueChanged.bind(this).call(this, value, source)
        if (this.conf.onValueChanged) this.conf.onValueChanged.bind(this).call(this, value, source)
      })
    }
  }

  renderPane () {
    const dom = document.createElement('div')

    dom.classList.add(this.conf.classNames.base, this.conf.classNames.pane)

    if (this.conf.extraClasses) dom.classList.add(...this.conf.extraClasses)

    return dom
  }

  renderTitle () {
    const dom = document.createElement('div')

    dom.classList.add(this.conf.classNames.title)
    dom.innerHTML = this.conf.title

    return dom
  }

  renderSubTitle () {
    const dom = document.createElement('div')

    dom.classList.add(this.conf.classNames.subtitle)
    dom.innerHTML = this.conf.subTitle

    return dom
  }

  renderFooter () {
    const dom = document.createElement('div')

    dom.classList.add(this.conf.classNames.footer)

    if (this.conf.title) {
      this.dom.title = this.renderTitle()
      dom.appendChild(this.dom.title)
    }

    if (this.conf.subTitle) {
      this.dom.subTitle = this.renderSubTitle()
      dom.appendChild(this.dom.subTitle)
    }

    return dom
  }

  renderContent () {
    const dom = document.createElement('div')

    dom.classList.add(this.conf.classNames.content)

    if (this.conf.fitText) dom.fitText = new FitText(dom)

    return dom
  }

  render () {
    const pane = this.renderPane()

    if (this.conf.source) {
      this.dom.content = this.renderContent()
      pane.appendChild(this.dom.content)
    }

    if (this.conf.title || this.conf.subtitle) {
      this.dom.footer = this.renderFooter()
      pane.appendChild(this.dom.footer)
    }

    this.dom.pane = pane

    return this.dom.pane
  }

  fetchSource () {
    const source = this.conf.source
    const promise = source.getData().catch(err => {
      throw Error(err)
    })

    if (source instanceof Xhr) {
      promise.then(() => setTimeout(this.fetchSource.bind(this), source.getTimeout()))
    }

    return promise
  }

  setContentData (dom, value) {
    dom.content.innerHTML = value

    const fitText = get(this, 'dom.content.fitText')
    fitText && fitText.setCalculatedFontSize()

    return this
  }

  handlerValueChanged (value, source) {
    this.setContentData(this.dom, value)

    if (source instanceof Xhr && source.getTimeout() <= 3000) return

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

  onValueChanged (cb) {
    this.conf.onValueChanged = cb

    this.initialize()

    return this
  }
}
