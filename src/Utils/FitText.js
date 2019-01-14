import merge from 'lodash/merge'

export default class FitText {
  constructor (elm, conf) {
    if (!elm) throw Error('[FitText] Element must be defined!')

    const computedFontSize = parseFloat(
      window.getComputedStyle(document.body).getPropertyValue('font-size')
    )

    const defaults = {
      compressor: 1,
      minFontSize: computedFontSize / 2,
      maxFontSize: Number.POSITIVE_INFINITY
    }

    this.elm = elm
    this.conf = merge({}, defaults, conf)

    this.bindEvents()
    this.resize()

    return this
  }

  resize () {
    const elmWidth = this.elm.offsetWidth
    const compressor = this.conf.compressor * 5
    const minFs = parseFloat(this.conf.minFontSize)
    const maxFs = parseFloat(this.conf.maxFontSize)
    const fontSize = Math.max(Math.min(elmWidth / compressor, maxFs), minFs)
    this.elm.style.fontSize = `${fontSize}px`
  }

  bindEvents () {
    const resizeFn = this.resize.bind(this)

    window.addEventListener('resize', resizeFn)
    window.addEventListener('orientationchange', resizeFn)
    window.addEventListener('fittext', resizeFn)
    window.addEventListener('resize.fittext', resizeFn)
    window.addEventListener('orientationchange.fittext', resizeFn)
  }
}
