'use strict'

const fs = require('fs')
const ndjson = require('ndjson')
const toArray = require('get-stream').array

const positions = () => toArray(
    fs.createReadStream('./data.ndjson')
    .pipe(ndjson.parse())
)

module.exports = positions
