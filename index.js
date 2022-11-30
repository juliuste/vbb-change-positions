'use strict'

const fs = require('fs')
const path = require('path')
const ndjson = require('ndjson')

const createVbbChangePositionsStream = () =>
    fs.createReadStream(path.join(__dirname, 'data.ndjson'))
    .pipe(ndjson.parse())

module.exports = createVbbChangePositionsStream
