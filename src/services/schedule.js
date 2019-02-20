'use strict';

const database = require('./database');

class Schedule {

	constructor(config) {
		this.connection = new database(config).connection;
	}

	lookup(id) {
		return new Promise((resolve, reject) => {
			this.connection.connect((err) => {
				if (err) {
					reject({
						"message": "The database could not be reached"
					});
				} else {
					this.connection.query(
						'SELECT content, start_date, complete_date FROM jobs WHERE id = ?',[ id ],
						(err, results) => {
							if (err) {
								reject({
									"message": err
								});
							} else if (!results[0]) {
								reject({
									"message": "Invalid job id " + id
								});
							} else if (!results[0].complete_date) {
								resolve({
									"message": "Job id " + id + " has not yet been completed"
								});
							} else {
								resolve({
									"content": results[0].content,
									"startDate": results[0].start_date,
									"completeDate": results[0].complete_date
								});
							}
						}
					);
					this.connection.end();
				}
			});
		});
	}

	submit(url, callback) {
		return new Promise((resolve, reject) => {
			this.connection.connect((err) => {
				if (err) {
					reject({
						"message": "The database could not be reached"
					});
				} else {
					if (url) {
						if (url.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)) {
							if (this.connection) {
								this.connection.query(
					    			'INSERT INTO jobs(url, start_date) VALUES (?, ?)',[ url, new Date() ],
					    			(err, results) => {
										if (err) {
											reject({
												"message": JSON.stringify(err)
											});
										} else {
											resolve({
												"message": "Success",
												"id": results.insertId
											});
										}
					    			}
								);
							} else {
								reject({
									"message": "The database could not be reached"
								});
							}
						} else {
							reject({
								"message": "The URL is malformed"
							});
						}
					} else {
						reject({
							"message": "The URL cannot be blank"
						});
					}
				}
				this.connection.end();
			});
		});
	}
}

module.exports = Schedule;
