'use strict';
const config = require('./config');
const fetch = require('./workers/fetch');
const schedule = require('./services/schedule');
const { fork } = require('child_process');

class Batch {

	constructor(config) {
		this.config = config;
	}

	workers() {
		return [
			{
				"name": "fetch",
				"work": () => {
					console.log('getting list of fetch tasks');
					let scheduler = new schedule(this.config);
					scheduler.tasks()
						.then((tasks) => {
							console.log(tasks);
							tasks.forEach((task) => {
								const fetcher = fork('./src/workers/fetch.js');
								fetcher.send({ config: config, id: task.id }, () => {
									console.log('requested asynchronous work from forked process fetcher for task id ' + task.id);
								});
							});
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}
		]
	}

	run() {
		setInterval(() => {
			this.workers().forEach((worker) => {
				console.log('running worker ' + worker.name);
				worker.work();
			});
		}, this.config.pollIntervalInSeconds * 1000);
	}
}

let batcher = new Batch(config);
batcher.run();
