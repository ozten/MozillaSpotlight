DROP DATABASE IF EXISTS mozillaspotlight;
CREATE DATABASE mozillaspotlight COLLATE=utf8_general_ci;
USE mozillaspotlight;

DROP TABLE IF EXISTS mozillian;
/* mozillians - The pool of all avaiable mozillians */
CREATE TABLE IF NOT EXISTS mozillian (
    email_address VARCHAR(254),
    invited ENUM('Y', 'N'),
    unsubscribed ENUM('Y', 'N')
) ENGINE=MyISAM;

DROP TABLE IF EXISTS spotlight;
/* spotlight - A specific video spotlight featured for a day */
CREATE TABLE IF NOT EXISTS spotlight (
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    created_date TIMESTAMP,
    updated_date TIMESTAMP,
    full_name VARCHAR(255),
    embed_code VARCHAR(5000),
    PRIMARY KEY (id)
) ENGINE=MyISAM;

DROP TABLE IF EXISTS spotlight_workflow;
CREATE TABLE IF NOT EXISTS spotlight_workflow (
    email_address VARCHAR(254),
    status ENUM('I', 'A', 'C') /* Invited, Assignment Read, Completed */
) ENGINE=MyISAM;

DROP TABLE IF EXISTS schedule;
CREATE TABLE IF NOT EXISTS schedule (
    publish_date TIMESTAMP,
    spotlight_id MEDIUMINT NOT NULL,
    FOREIGN KEY (spotlight_id) REFERENCES spotlight(id)
) ENGINE=MyISAM;

