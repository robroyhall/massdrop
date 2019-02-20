'use strict';
const config = require('./config');
const express = require('express');
const fetch = require('./workers/fetch');
const schedule = require('./services/schedule');
const { fork } = require('child_process');

const app = express();
app.listen(8000, () => {
	console.log('Server running on port 8000');
});

const fetcher = fork('./src/workers/fetch.js');

app.get('/url/results', (req, res) => {
	let scheduler = new schedule(config);
	scheduler.lookup(req.query.id)
		.then((results) => {
			res.json(results);
		})
		.catch((err) => {
			res.json(err);
		});
  })

// NOTE: this should be done using app.post (or app.route)
// but it's easier to test for now in a browser using a separate GET endpoint
app.get('/url/fetch', (req, res) => {
	let scheduler = new schedule(config);
	scheduler.submit(req.query.address)
		.then((results) => {
			if (results.id) {
				console.log('launching worker for job id ' + results.id);
				fetcher.send({ config: config, id: results.id }, () => {
					console.log('sent message to fetcher');
				});
			}
			res.json(results);
		})
		.catch((err) => {
			res.json(err);
		});
});
