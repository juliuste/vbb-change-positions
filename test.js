'use strict'

const test = require('tape')
const isObject = require('lodash/isObject')
const isString = require('lodash/isString')
const isNumber = require('lodash/isNumber')
const isBoolean = require('lodash/isBoolean')
const ndjson = require('ndjson')
const path = require('path')
const fs = require('fs')
const isStream = require('is-stream')
const getStations = require('vbb-stations')
const linesAt = require('vbb-lines-at')

const changePositions = require('.')
const changePositionsBrowser = require('./browser')
const dataFile = path.join(__dirname, 'data.ndjson')

const notNullString = (x) => isString(x) && !!x
const undefinedOrString = (x) => (isString(x) && !!x) || x === undefined
const validPosition = (x) => isNumber(x) && x >= 0 && x <= 1

const checkLines = (t, stationId, lines, desc) => {
	t.ok(Array.isArray(lines), desc + ' must be an array')
	if (!Array.isArray(lines)) return;
	t.ok(lines.length > 0, desc + ' must have >0 entries')
	t.ok(lines.every(notNullString), desc + ' must not contain empty strings')

	const _linesAt = linesAt[stationId]
	t.ok(_linesAt, `${desc}: vbb-lines-at has no lines for ${stationId}`)

	const lineNamesAt = _linesAt.map(l => l.name)
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		t.ok(
			lineNamesAt.includes(line),
			`${desc}[${i}]: line "${line}" is not in vbb-lines-at[${stationId}]`,
		)
	}
}

const checkPosition = (t, p, rowNr) => {
	let desc = 'row ' + rowNr
	if (p.fromStation && p.toStation) {
		if (p.fromStation.name && p.toStation.name) desc += ' (' + p.fromStation.name + ' / ' + p.toStation.name + ')'
		else if (p.fromStation.id && p.toStation.id) desc += ' (' + p.fromStation.id + ' / ' + p.toStation.id + ')'
	}

	t.ok(isObject(p.fromStation), desc + ' fromStation')
	t.ok(notNullString(p.fromStation.id), desc + ' fromStation.id')
	const [from] = getStations(p.fromStation.id)
	t.ok(from, desc + ' fromStation.id: ' + p.fromStation.id)
	t.ok(undefinedOrString(p.fromStation.name), desc + ' fromStation.name')
	checkLines(t, p.fromStation.id, p.fromLines, desc + ' fromStation: fromLines')

	t.ok(isObject(p.previousStation), desc + ' previousStation')
	t.ok(notNullString(p.previousStation.id), desc + ' previousStation.id')
	const [prev] = getStations(p.previousStation.id)
	t.ok(prev, desc + ' previousStation.id: ' + p.previousStation.id)
	t.ok(undefinedOrString(p.previousStation.name), desc + ' previousStation.name')
	checkLines(t, p.previousStation.id, p.fromLines, desc + ' previousStation: fromLines')

	t.ok(undefinedOrString(p.fromTrack), desc + ' fromTrack')
	t.ok(validPosition(p.fromPosition), desc + ' fromPosition')

	t.ok(isObject(p.toStation), desc + ' toStation')
	t.ok(notNullString(p.toStation.id), desc + ' toStation.id')
	const [to] = getStations(p.toStation.id)
	t.ok(to, desc + ' toStation.id: ' + p.toStation.id)
	t.ok(undefinedOrString(p.toStation.name), desc + ' toStation.name')
	checkLines(t, p.toStation.id, p.toLines, desc + ' toStation: toLines')

	t.ok(isObject(p.nextStation), desc + ' nextStation')
	t.ok(notNullString(p.nextStation.id), desc + ' nextStation.id')
	const [next] = getStations(p.nextStation.id)
	t.ok(next, desc + ' nextStation.id: ' + p.nextStation.id)
	t.ok(undefinedOrString(p.nextStation.name), desc + ' nextStation.name')
	checkLines(t, p.nextStation.id, p.toLines, desc + ' nextStation: toLines')

	t.ok(undefinedOrString(p.toTrack), desc + ' toTrack')
	t.ok(validPosition(p.toPosition), desc + ' toPosition')

	t.ok(isBoolean(p.samePlatform), desc + ' samePlatform')
}

test('data.ndjson looks correct', (t) => {
	fs.createReadStream(dataFile)
	.on('error', err => t.ifError(err))
	.pipe(ndjson.parse())
	.on('error', err => t.ifError(err))
	.on('data', () => {})
	.once('end', () => t.end())
})

test('returns correct values', async (t) => {
	const positions = changePositions()
	t.ok(isStream.readable(positions))

	let rowNr = 1
	for await (const p of positions) {
		checkPosition(t, p, rowNr++)
	}
})

test('browser.js returns correct values', async (t) => {
	const positions = changePositionsBrowser()
	t.ok(isStream.readable(positions))

	let rowNr = 1
	for await (const p of positions) {
		checkPosition(t, p, rowNr++)
	}
})
