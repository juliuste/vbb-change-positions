'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const linter = require('csvlint')
const isString = require('lodash.isstring')
const isNumber = require('lodash.isnumber')
const isBoolean = require('lodash.isboolean')
const toArray = require('get-stream').array
const fs = require('fs')
const changePositions = require('.')

const notNullString = (x) => isString(x) && !!x
const nullString = (x) => (isString(x) && !!x) || x === null
const validPosition = (x) => isNumber(x) && x >= 0 && x <= 1

const test = tapePromise(tape)

test('vbb-change-positions', async (t) => {
	const lint = await toArray(fs.createReadStream('./data.csv').pipe(linter()))
	.then(() => t.pass('linter'))
	.catch((error) => {
		t.fail('linter')
		console.error(error)
	})

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
