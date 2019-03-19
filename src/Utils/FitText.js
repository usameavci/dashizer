import merge from 'lodash/merge'

export default class FitText {
  constructor (element, conf) {
    const defaults = {
      increaseAmount: 1,
      minFontSize: this.getComputedNumber(document.body, 'font-size')
    }

    this.conf = merge({}, defaults, conf)

    this.element = element

    this.setCalculatedFontSize()
    this.bindEvents()
  }

  createClone () {
    var content = this.element.innerHTML
    var vdom = document.createElement('div')
    var pPaddingL = this.getComputedNumber(this.element, 'padding-left')
    var pPaddingR = this.getComputedNumber(this.element, 'padding-right')
    vdom.className = 'fittext-clone'
    vdom.style.paddingLeft = pPaddingL + 'px'
    vdom.style.paddingRight = pPaddingR + 'px'
    vdom.style.position = 'absolute'
    vdom.style.display = 'inline'
    vdom.style.left = 0
    vdom.style.top = 0
    vdom.style.opacity = 0
    vdom.style.zIndex = -9999

    vdom.innerHTML = content

    this.clonedElement = vdom
    this.element.append(vdom)

    return this
  }

  removeClone () {
    this.clonedElement.remove()

    return this
  }

  attachParentPosition () {
    this.element.dataset.oldPosition = this.getComputed(this.element, 'position')
    this.element.style.position = 'relative'

    return this
  }

  detachParentPosition () {
    this.element.style.position = null

    delete this.element.dataset.oldPosition

    return this
  }

  setCalculatedFontSize () {
    this.createClone()
    this.attachParentPosition()

    this.clonedElement.style.fontSize = '0px'
    this.calculatedFontSize = this.calculateFontSize()
    this.element.style.fontSize = this.calculatedFontSize + 'px'

    this.removeClone()
    this.detachParentPosition()

    return this
  }

  getComputed (elm, prop) {
    return window.getComputedStyle(elm).getPropertyValue(prop)
  }

  getComputedNumber (elm, prop, strWillRemove = 'px') {
    var value = this.getComputed(elm, prop)

    if (!value) return 0

    value = value.replace(strWillRemove, '')

    return parseInt(value, 10)
  }

  calculateFontSize () {
    const clonedElemetFontSize = this.getComputedNumber(this.clonedElement, 'font-size')
    const clonedElementWidth = this.getComputedNumber(this.clonedElement, 'width')
    const elementWidth = this.getComputedNumber(this.element, 'width')

    this.clonedElement.style.fontSize = clonedElemetFontSize + this.conf.increaseAmount + 'px'

    if (clonedElementWidth >= elementWidth) {
      const calculatedFontSize = clonedElemetFontSize - this.conf.increaseAmount

      return calculatedFontSize < this.conf.minFontSize ? this.conf.minFontSize : calculatedFontSize
    }

    return this.calculateFontSize()
  }

  bindEvents () {
    const resizeFn = this.setCalculatedFontSize.bind(this)

    window.addEventListener('resize', () => {
      clearTimeout(window.resizeFinished)

      window.resizeFinished = setTimeout(resizeFn, 250)
    })

    window.addEventListener('orientationchange', resizeFn)
  }
}
