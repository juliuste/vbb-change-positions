'use strict'

const fs = require('fs')
const csv = require('csv-parse')
const toArray = require('get-stream').array

const transformRow = (r) => {
    if(!r.stationName) r.stationName = null
    if(!r.fromStationName) r.fromStationName = null
    if(!r.fromPlatform) r.fromPlatform = null
    r.fromPosition = +r.fromPosition
    if(!r.toStationName) r.toStationName = null
    if(!r.toPlatform) r.toPlatform = null
    r.toPosition = +r.toPosition
    return r
}

const positions = () => toArray(
    fs.createReadStream('./data.csv')
    .pipe(csv({columns: true}))
).then((res) => res.map(transformRow))

module.exports = positions
