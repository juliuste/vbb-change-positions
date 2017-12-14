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
	for(let position of positions){
		t.ok(notNullString(position.station), (position.stationName || position.station) + ' station')
		t.ok(nullString(position.stationName), (position.stationName || position.station) + ' stationName')

		t.ok(notNullString(position.fromLine), (position.stationName || position.station) + ' fromLine')
		t.ok(notNullString(position.fromStation), (position.stationName || position.station) + ' fromStation')
		t.ok(nullString(position.fromStationName), (position.stationName || position.station) + ' fromStationName')
		t.ok(nullString(position.fromTrack), (position.stationName || position.station) + ' fromTrack')
		t.ok(validPosition(position.fromPosition), (position.stationName || position.station) + ' fromPosition')

		t.ok(notNullString(position.toLine), (position.stationName || position.station) + ' toLine')
		t.ok(notNullString(position.toStation), (position.stationName || position.station) + ' toStation')
		t.ok(nullString(position.toStationName), (position.stationName || position.station) + ' toStationName')
		t.ok(nullString(position.toTrack), (position.stationName || position.station) + ' toTrack')
		t.ok(validPosition(position.toPosition), (position.stationName || position.station) + ' toPosition')

		t.ok(isBoolean(position.samePlatform), (position.stationName || position.station) + ' samePlatform')
	}
	t.end()
})
