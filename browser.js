'use strict'

const fromArray = require('from2-array')
const data = require('./data.json')

const positions = () => fromArray.obj(data)

module.exports = positions
