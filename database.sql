CREATE DATABASE scheduler;

USE scheduler;

CREATE TABLE jobs (
     id MEDIUMINT NOT NULL AUTO_INCREMENT,
     url TINYTEXT NOT NULL,
	 content LONGTEXT NULL,
	 start_date CHAR(40) NULL,
	 complete_date CHAR(40) NULL,
     PRIMARY KEY (id)
);
