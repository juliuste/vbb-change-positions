'use strict'

const fs = require('fs')
const ndjson = require('ndjson')

const positions = () => {
    return fs.createReadStream('./data.ndjson')
    .pipe(ndjson.parse())
}

module.exports = positions
