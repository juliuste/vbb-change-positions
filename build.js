'use strict'

const {join} = require('path')
const {createReadStream} = require('fs')
const {parse: parseNdjson} = require('ndjson')
const {array: asArray} = require('get-stream')

const onError = (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
}

const src = join(__dirname, 'data.ndjson')

const readable = createReadStream(src)
.once('error', onError)
.pipe(parseNdjson())
.once('error', onError)

asArray(readable)
.then((data) => {
	process.stdout.write(JSON.stringify(data) + '\n')
})
.catch(onError)
