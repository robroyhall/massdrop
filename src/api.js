'use strict';
const config = require('./config');
const express = require('express');
const schedule = require('./services/schedule');

const api = express();
api.listen(8000, () => {
	console.log('API running on port 8000');
});

api.get('/url/results', (req, res) => {
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
api.get('/url/fetch', (req, res) => {
	let scheduler = new schedule(config);
	scheduler.submit(req.query.address)
		.then((results) => {
			res.json(results);
		})
		.catch((err) => {
			res.json(err);
		});
});
