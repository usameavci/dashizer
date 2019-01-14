import range from 'lodash/range'

export default class Classic {
  constructor (conf) {
    const defaults = {
      columns: 18,
      rows: 6,
      mount: 'body',
      classNames: {
        base: 'dashizer-dashboard',
        dashboard: 'dashizer-dashboard__classic'
      }
    }

    this.conf = Object.assign({}, defaults, conf)
    this.panes = []
    this.mounted = null

    this.createBoard()
  }

  createBoard () {
    const elmMount = document.querySelector(this.conf.mount)
    const elmContainer = document.createElement('div')

    elmContainer.classList.add(this.conf.classNames.base, this.conf.classNames.dashboard)

    if (!this.mounted) {
      this.mounted = elmMount.appendChild(elmContainer)
    }
  }

  add (...pane) {
    pane.forEach((p, index) => {
      if (p.conf.columns > this.conf.columns) {
        throw Error('The columns of the pane cannot be greater than the columns of the dashboard!')
      }

      if (p.conf.rows > this.conf.rows) {
        throw Error('The rows of the pane cannot be greater than the rows of the dashboard!')
      }

      this.panes.push(p)
      const pane = p.render()

      p.id = `dp-${index}`
      p.dom.pane.id = p.id

      this.mounted.appendChild(pane)

      p.fetchSource()
    })

    this.updateLayout()
  }

  updateLayout () {
    const wColumns = this.conf.columns
    const wRows = this.conf.rows

    let areas = []

    this.panes.forEach(p => {
      p.dom.pane.style.gridArea = p.id

      const rowStart = this.findRow(areas, p, 0)

      for (let r = rowStart; r <= p.conf.rows - 1 + rowStart; r++) {
        areas[r] = areas[r] || []

        let colStart = areas[r].length

        if (areas[r - 1] && areas[r - 1].indexOf(p.id) !== -1) {
          colStart = areas[r - 1].length - p.conf.columns

          if (colStart > 0 && areas[r].length < colStart) {
            range(0, colStart).forEach(i => areas[r].push('.'))
          }
        }

        for (let c = colStart; c <= p.conf.columns - 1 + colStart; c++) areas[r].push(p.id)
      }
    })

    this.mounted.style.gridTemplateAreas = areas
      .map(r => {
        const count = wColumns - r.length

        for (let i = 0; i <= count - 1; i++) r.push('.')

        return `"${r.join(' ')}"`
      })
      .join('\n')

    this.mounted.style.gridTemplateColumns = range(0, wColumns)
      .map(() => '1fr')
      .join(' ')
    this.mounted.style.gridTemplateRows = range(0, wRows)
      .map(() => '1fr')
      .join(' ')
  }

  findRow (areas, pane, r) {
    areas[r] = areas[r] || []

    if (this.conf.columns - areas[r].length < pane.conf.columns) {
      return this.findRow(areas, pane, ++r)
    }

    return r
  }
}
