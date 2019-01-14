const express = require('express')
const path = require('path')
const random = require('lodash/random')

const App = express()
const valueDB = {}

App.use(express.static(__dirname))
App.use(express.static(path.join(__dirname, '..')))

App.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')

  res.randomInt = (max) => Math.floor(Math.random() * Math.floor(max))

  res.randomValue = (res, max) => {
    const delay = !valueDB[req.url] ? 0 : random(1, 6) * 1000

    if (res.randomInt(20) % 2 === 0 || !valueDB[req.url]) valueDB[req.url] = random(0, max)

    setTimeout(() => res.json({ count: valueDB[req.url] }), delay)
  }

  next()
})

App.get('/docs', (req, res) => res.sendFile(path.join(__dirname, 'docs.html')))
App.get('/api/products', (req, res) => res.randomValue(res, 1000000))
App.get('/api/contracts', (req, res) => res.randomValue(res, 1000000))
App.get('/api/projects', (req, res) => res.randomValue(res, 1000000))
App.get('/api/items', (req, res) => res.randomValue(res, 1000000))
App.get('/api/users', (req, res) => res.randomValue(res, 1000000))
App.get('/api/sessions', (req, res) => res.randomValue(res, 1000000))

const port = process.env.PORT || 4001

App.listen(port, () => console.log(`Example app running on ${port}`))
