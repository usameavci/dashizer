import Text from './Text'

export default class Xhr extends Text {
  constructor (conf) {
    const defaults = {
      url: null,
      timeout: 15 * 1000,
      handler: r => r,
      xhrOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    }

    conf = Object.assign({}, defaults, conf)

    super(conf)
  }

  setUrl (url) {
    this.conf.url = url

    return this
  }

  getUrl () {
    return this.conf.url
  }

  setHandler (handlerFn) {
    this.conf.handler = handlerFn

    return this
  }

  getHandler () {
    return this.conf.handler
  }

  setTimeout (timeout) {
    this.conf.timeout = timeout

    return this
  }

  getTimeout () {
    return this.conf.timeout
  }

  getData () {
    if (!this.conf.url) throw Error('Url must be defined!')

    const xhrOptions = this.conf.xhrOptions || {}

    return new Promise((resolve, reject) => {
      window &&
        window
          .fetch(this.conf.url, xhrOptions)
          .then(response => response.json())
          .then(response => {
            const value = this.conf.handler(response)

            if (this.lastValue !== value) {
              this.events.onValueChanged(value, this)
              this.lastValue = value
            }

            return resolve(value)
          })
          .catch(err => reject(err))
    })
  }
}
