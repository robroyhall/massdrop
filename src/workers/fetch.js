'use strict';

const curl = require('curl-request');
const database = require('../services/database');

class Fetch {

	constructor(config) {
		this.connection = new database(config).connection;
	}

	fetch(id) {
		return new Promise((resolve, reject) => {
			this.connection.connect((err) => {
				if (err) {
					reject({
						"message": "The database could not be reached"
					});
				} else {
					console.log('getting details for job id ' + id);
					this.connection.query(
						'SELECT url, complete_date FROM jobs WHERE id = ?',[ id ],
						(err, results) => {
							if (err) {
								reject({
									"message": err
								});
							} else if (results && results[0]) {
								if (!results[0].complete_date) {
									let url = results[0].url;
									console.log('setting start_date for job id ' + id);
									this.connection.query(
										'UPDATE jobs SET start_date = ? WHERE id = ?',[ new Date(), id ],
										(err, results) => {
											if (err) {
												reject({
													"message": err
												});
												this.connection.end();
											} else {
												var curler = new curl();
												curler.get(url)
													.then(({ statusCode, body, headers }) => {
														console.log('saving content for job id ' + id);
														this.connection.query(
															'UPDATE jobs SET content = ?, complete_date = ? WHERE id = ?',[ body.replace(/[\u0800-\uFFFF]/g, ''), new Date(), id ],
															(err, results) => {
																if (err) {
																	reject({
																		"message": err
																	});
																} else {
																	resolve({
																		"message": results
																	});
																}
																this.connection.end();
															}
														);
													})
													.catch((err) => {
														let curlError = err;
														console.log('error getting content for job id ' + id + ': ' + curlError);
														this.connection.query(
															'UPDATE jobs SET complete_date = ? WHERE id = ?',[ new Date(), id ],
															(err, results) => {
																if (err) {
																	reject({
																		"message": err
																	});
																} else {
																	reject({
																		"message": curlError
																	});
																}
																this.connection.end();
															}
														);
													});
											}
										}
									);
								} else {
									reject({
										"message": "The job for id " + id + " has already been completed"
									});
									this.connection.end();
								}
							} else {
								reject({
									"message": "The id " + id + " was not found"
								});
								this.connection.end();
							}
						}
					);
				}
			});
		});
	}
}

process.on('message', async (message) => {
	const fetcher = new Fetch(message.config);
	const response = await fetcher.fetch(message.id);
	console.log('fetch response:', response);
});

module.exports = Fetch;
