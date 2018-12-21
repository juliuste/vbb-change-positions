'use strict'

const test = require('tape')
const isObject = require('lodash.isobject')
const isString = require('lodash.isstring')
const isNumber = require('lodash.isnumber')
const isArray = require('lodash.isarray')
const isBoolean = require('lodash.isboolean')
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

const checkPosition = (t, p, i) => {
	let desc = 'row ' + i
	if (p.fromStation && p.toStation) {
		if (p.fromStation.name && p.toStation.name) desc += ' (' + p.fromStation.name + ' / ' + p.toStation.name + ')'
		else if (p.fromStation.id && p.toStation.id) desc += ' (' + p.fromStation.id + ' / ' + p.toStation.id + ')'
	}

	t.ok(isObject(p.fromStation), desc + ' fromStation')
	t.ok(notNullString(p.fromStation.id), desc + ' fromStation.id')
	const [from] = getStations(p.fromStation.id)
	t.ok(from, desc + ' fromStation.id')
	t.ok(undefinedOrString(p.fromStation.name), desc + ' fromStation.name')
	t.ok(isObject(p.previousStation), desc + ' previousStation')
	t.ok(notNullString(p.previousStation.id), desc + ' previousStation.id')
	const [prev] = getStations(p.previousStation.id)
	t.ok(prev, desc + ' previousStation.id')
	t.ok(undefinedOrString(p.previousStation.name), desc + ' previousStation.name')
	t.ok(isArray(p.fromLines) && p.fromLines.length > 0 && p.fromLines.every(notNullString), desc + ' fromLines')
	const fromStationLines = linesAt[p.fromStation.id].map(l => l.name)
	const prevStationLines = linesAt[p.previousStation.id].map(l => l.name)
	t.ok(p.fromLines.every(l => fromStationLines.includes(l)), desc + ' fromLines')
	t.ok(p.fromLines.every(l => prevStationLines.includes(l)), desc + ' fromLines')
	t.ok(undefinedOrString(p.fromTrack), desc + ' fromTrack')
	t.ok(validPosition(p.fromPosition), desc + ' fromPosition')

	t.ok(isObject(p.toStation), desc + ' toStation')
	t.ok(notNullString(p.toStation.id), desc + ' toStation.id')
	const [to] = getStations(p.toStation.id)
	t.ok(to, desc + ' toStation.id')
	t.ok(undefinedOrString(p.toStation.name), desc + ' toStation.name')
	t.ok(isObject(p.nextStation), desc + ' nextStation')
	t.ok(notNullString(p.nextStation.id), desc + ' nextStation.id')
	const [next] = getStations(p.nextStation.id)
	t.ok(next, desc + ' nextStation.id')
	t.ok(undefinedOrString(p.nextStation.name), desc + ' nextStation.name')
	t.ok(isArray(p.toLines) && p.toLines.length > 0 && p.toLines.every(notNullString), desc + ' toLines')
	const toStationLines = linesAt[p.toStation.id].map(l => l.name)
	const nextStationLines = linesAt[p.nextStation.id].map(l => l.name)
	t.ok(p.toLines.every(l => toStationLines.includes(l)), desc + ' toLines')
	t.ok(p.toLines.every(l => nextStationLines.includes(l)), desc + ' toLines')
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

test('returns correct values', (t) => {
	const positions = changePositions()
	t.ok(isStream.readable(positions))

	let i = 0
	positions.on('data', p => checkPosition(t, p, i++))

	positions.on('error', err => t.ifError(err))
	positions.once('end', () => t.end())
})

test('browser.js returns correct values', (t) => {
	const positions = changePositionsBrowser()
	t.ok(isStream.readable(positions))

	let i = 0
	positions.on('data', p => checkPosition(t, p, i++))

	positions.on('error', err => t.ifError(err))
	positions.once('end', () => t.end())
})
