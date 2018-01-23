'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const isString = require('lodash.isstring')
const isNumber = require('lodash.isnumber')
const isArray = require('lodash.isarray')
const isBoolean = require('lodash.isboolean')
const ndjson = require('ndjson')
const toArray = require('get-stream').array
const path = require('path')
const fs = require('fs')
const getStations = require('vbb-stations')

const changePositions = require('.')

const notNullString = (x) => isString(x) && !!x
const undefinedOrString = (x) => (isString(x) && !!x) || x === undefined
const validPosition = (x) => isNumber(x) && x >= 0 && x <= 1

const dataFile = path.join(__dirname, 'data.ndjson')

const test = tapePromise(tape)

test('data.ndjson looks correct', (t) => {
	fs.createReadStream(dataFile)
	.on('error', err => t.ifError(err))
	.pipe(ndjson.parse())
	.on('error', err => t.ifError(err))
	.on('data', () => {})
	.once('end', () => t.end())
})

test('data.ndjson contains correct values', async (t) => {
	const positions = await changePositions()
	for (let i = 0; i < positions.length; i++) {
		const p = positions[i]
		let desc = 'row ' + i
		if (p.stationName) desc += ' (' + p.stationName + ')'
		else if (p.station) desc += ' (' + p.station + ')'

		t.ok(notNullString(p.station), desc + ' station')
		const [s] = getStations(p.station)
		t.ok(s, desc + ' station')
		t.ok(undefinedOrString(p.stationName), desc + ' stationName')

		t.ok(isArray(p.fromLines) && p.fromLines.length > 0 && p.fromLines.every(notNullString), desc + ' fromLines')
		t.ok(notNullString(p.fromStation), desc + ' fromStation')
		const [fS] = getStations(p.fromStation)
		t.ok(fS, desc + ' station')
		t.ok(undefinedOrString(p.fromStationName), desc + ' fromStationName')
		t.ok(undefinedOrString(p.fromTrack), desc + ' fromTrack')
		t.ok(validPosition(p.fromPosition), desc + ' fromPosition')

		t.ok(isArray(p.toLines) && p.toLines.length > 0 && p.toLines.every(notNullString), desc + ' toLines')
		t.ok(notNullString(p.toStation), desc + ' toStation')
		const [tS] = getStations(p.toStation)
		t.ok(tS, desc + ' station')
		t.ok(undefinedOrString(p.toStationName), desc + ' toStationName')
		t.ok(undefinedOrString(p.toTrack), desc + ' toTrack')
		t.ok(validPosition(p.toPosition), desc + ' toPosition')

		t.ok(isBoolean(p.samePlatform), desc + ' samePlatform')
	}
	t.end()
})
