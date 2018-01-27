'use strict'

const fs = require('fs')
const path = require('path')
const ndjson = require('ndjson')
const toArray = require('get-stream').array

const positions = () => toArray(
    fs.createReadStream(path.join(__dirname, 'data.ndjson'))
    .pipe(ndjson.parse())
)

module.exports = positions
