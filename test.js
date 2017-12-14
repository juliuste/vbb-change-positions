'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const isString = require('lodash.isstring')
const isNumber = require('lodash.isnumber')
const isBoolean = require('lodash.isboolean')
const parseCsv = require('csv-parser')
const toArray = require('get-stream').array
const path = require('path')
const fs = require('fs')
const getStations = require('vbb-stations')

const changePositions = require('.')

const notNullString = (x) => isString(x) && !!x
const nullString = (x) => (isString(x) && !!x) || x === null
const validPosition = (x) => isNumber(x) && x >= 0 && x <= 1

const dataFile = path.join(__dirname, 'data.csv')

const test = tapePromise(tape)

test('data.csv looks correct', (t) => {
	const parser = parseCsv()
	parser.once('headers', (headers) => {
		t.deepEqual(headers, [
			'station',
			'stationName',
			'fromLine',
			'fromStation',
			'fromStationName',
			'fromTrack',
			'fromPosition',
			'toLine',
			'toStation',
			'toStationName',
			'toTrack',
			'toPosition',
			'samePlatform'
		])
	})

	fs.createReadStream(dataFile)
	.on('error', err => t.ifError(err))
	.pipe(parser)
	.on('error', err => t.ifError(err))
	.on('data', () => {})
	.once('end', () => t.end())
})

test('data.csv contains correct values', async (t) => {
	const positions = await changePositions()
	for (let i = 0; i < positions.length; i++) {
		const p = positions[i]
		let desc = 'row ' + i
		if (p.stationName) desc += ' (' + p.stationName + ')'
		else if (p.station) desc += ' (' + p.station + ')'

		t.ok(notNullString(p.station), desc + ' station')
		const [s] = getStations(p.station)
		t.ok(s, desc + ' station')
		t.ok(nullString(p.stationName), desc + ' stationName')

		t.ok(notNullString(p.fromLine), desc + ' fromLine')
		t.ok(notNullString(p.fromStation), desc + ' fromStation')
		const [fS] = getStations(p.fromStation)
		t.ok(fS, desc + ' station')
		t.ok(nullString(p.fromStationName), desc + ' fromStationName')
		t.ok(nullString(p.fromTrack), desc + ' fromTrack')
		t.ok(validPosition(p.fromPosition), desc + ' fromPosition')

		t.ok(notNullString(p.toLine), desc + ' toLine')
		t.ok(notNullString(p.toStation), desc + ' toStation')
		const [tS] = getStations(p.toStation)
		t.ok(tS, desc + ' station')
		t.ok(nullString(p.toStationName), desc + ' toStationName')
		t.ok(nullString(p.toTrack), desc + ' toTrack')
		t.ok(validPosition(p.toPosition), desc + ' toPosition')

		t.ok(isBoolean(p.samePlatform), desc + ' samePlatform')
	}
	t.end()
})
