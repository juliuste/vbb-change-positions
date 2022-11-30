'use strict'

const {Readable} = require('stream')
const data = require('./data.json')

const positions = () => {
	const lastI = data.length - 1

	let i = 0
	function read (amount) {
		const nextI = Math.min(i + amount, lastI)
		for (; i <= nextI; i++) {
			this.push(data[i])
		}
		if (i >= lastI) this.push(null) // end
	}

	return new Readable({
		objectMode: true,
		read,
	})
}

module.exports = positions
