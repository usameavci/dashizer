/*
 * Dashizer example
 */

var elmCanvas = document.createElement('canvas')
elmCanvas.id = 'example-canvas'
document.body.append(elmCanvas)

function playSound (url) {
  var audio = document.createElement('audio')
  audio.style.display = 'none'
  audio.src = url
  audio.autoplay = true
  audio.onended = function() {audio.remove()}
  document.body.appendChild(audio)
}

var onValueChanged = function(value, source) {
  var lastValue = source.getLastValue()
  var elmPane = document.getElementById(this.id)
  var elmContent = elmPane.querySelector('.' + this.conf.classNames.content)

  if (!this.countup) {
    var countUpOpts = { useEasing: true, useGrouping: true, separator: ',' }
    var countUpArgs = [elmContent, lastValue || value - 200, value, 0, 2, countUpOpts]
    this.countup = new CountUp(...countUpArgs)
    this.countup.start()
  } else {
    this.countup.update(value)
  }

  if (value > lastValue) {
    var confetti = new ConfettiGenerator({
      target: 'example-canvas',
      max: '250',
      size: '1.2',
      animate: true,
      props: ['square', 'triangle'],
      colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
      clock: '30',
      rotate: true
    })
    confetti.render()

    setTimeout(confetti.clear, 5000)
    playSound('/example/assets/up.mp3')
  } else if (value < lastValue) {
    playSound('/example/assets/down.mp3')
  }
}

var board = new Dashizer.Dashboards.Classic({
  columns: window.outerWidth < 768 ? 1 : 12,
  mount: '#example-root'
})

var sBase = new Dashizer.Sources.Xhr({
  handler: (response) => {
    return response.count
  }
})

var pProducts = new Dashizer.Panes.Metric({
  columns: window.outerWidth < 768 ? 1 : 4,
  title: 'Products',
  subTitle: 'Product Count',
  source: sBase.clone().setUrl('/api/products'),
  onValueChanged
})

var pLogo = new Dashizer.Panes.Image({
  columns: window.outerWidth < 768 ? 1 : 4,
  title: 'Dashizer Dev Team',
  height: 180,
  source: new Dashizer.Sources.Text().setData(`/example/assets/dashboard.svg`)
})

var pContracts = new Dashizer.Panes.Metric({
  columns: window.outerWidth < 768 ? 1 : 4,
  title: 'Contracts',
  subTitle: 'Contract Count',
  source: sBase.clone().setUrl('/api/contracts'),
  onValueChanged
})

var pProjects = new Dashizer.Panes.Metric({
  columns: window.outerWidth < 768 ? 1 : 3,
  rows: 2,
  title: 'Projects',
  source: sBase.clone().setUrl('/api/projects').setTimeout(10000),
  onValueChanged
})

var pItems = new Dashizer.Panes.Metric({
  columns: window.outerWidth < 768 ? 1 : 3,
  rows: 2,
  title: 'Items',
  source: sBase.clone().setUrl('/api/items').setTimeout(15000),
  onValueChanged
})

var pUsers = new Dashizer.Panes.Metric({
  columns: window.outerWidth < 768 ? 1 : 3,
  rows: 2,
  title: 'Users',
  source: sBase.clone().setUrl('/api/users').setTimeout(3000),
  onValueChanged
})

var pSessions = new Dashizer.Panes.Metric({
  columns: window.outerWidth < 768 ? 1 : 3,
  rows: 2,
  title: 'Sessions',
  source: sBase.clone().setUrl('/api/sessions').setTimeout(20000),
  onValueChanged
})

var pDocs = new Dashizer.Panes.Text({
  columns: window.outerWidth < 768 ? 1 : 6,
  rows: 2,
  extraClasses: ['show-above-canvas'],
  title: 'Are you interested?',
  source: new Dashizer.Sources.Text().setData('<a href="/docs">Go to docs!</a>')
})

var pGithub = new Dashizer.Panes.Text({
  columns: window.outerWidth < 768 ? 1 : 6,
  rows: 2,
  extraClasses: ['show-above-canvas'],
  title: 'Are you interested code?',
  source: new Dashizer.Sources.Text().setData('<a target="_blank" href="https://github.com/usameavci/dashizer">View on Github!</a>')
})

board.add(pProducts, pLogo, pContracts, pProjects, pItems, pUsers, pSessions, pDocs, pGithub)
