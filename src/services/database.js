'use strict';

const mysql = require('mysql');

class Database {

	constructor(config) {
		this.connection = mysql.createConnection({
		  host: config.host,
		  user: config.user,
		  password: config.password,
		  database: config.database
		});
	}
}

module.exports = Database;
