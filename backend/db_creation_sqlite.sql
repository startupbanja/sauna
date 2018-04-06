-- TIETOKANNAN JA TAULUJEN LUONTIKYSELYT

-- TODO: id rows were previously:
-- id INT PRIMARY KEY NOT NULL AUTO_INCREMENT
-- but our sqlite needs it to be this way, change later


-- CREATE DATABASE sauna_db

-- USE sauna_db

CREATE TABLE Users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type INT NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    password CHAR(64) NOT NULL,
    active BOOLEAN NOT NULL
);

CREATE TABLE CoachProfiles(
    user_id INT,
    name VARCHAR(30) NOT NULL,
    img_url VARCHAR(100),
    description VARCHAR(1000),
    company VARCHAR(20),
    email VARCHAR(50) NOT NULL,
    linkedin VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE StartupProfiles(
    user_id INT,
    name VARCHAR(30) NOT NULL,
    img_url VARCHAR(100),
    description VARCHAR(1000),
    email VARCHAR(50) NOT NULL,
    website VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TEMP VIEW IF NOT EXISTS Profiles AS
SELECT user_id, name, img_url, description, email, website, NULL AS company, NULL AS linkedin FROM StartupProfiles
	UNION ALL
SELECT user_id, name, img_url, description, email, NULL AS website, company, linkedin FROM CoachProfiles;

-- View that unifies the credentials and members.
CREATE TEMP VIEW IF NOT EXISTS CredentialsListEntries AS
SELECT user_id AS uid, company AS title, title AS content FROM Credentials
	UNION ALL
SELECT startup_id AS uid, name AS title, title AS content FROM TeamMembers;


CREATE TABLE Credentials(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT NOT NULL,
    company VARCHAR(20) NOT NULL,
    title VARCHAR(30) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE TeamMembers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INT NOT NULL,
    name VARCHAR(40) NOT NULL,
    title VARCHAR(30) NOT NULL,
    FOREIGN KEY (startup_id) REFERENCES Users(id)
);

CREATE TABLE Timeslots(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
		FOREIGN KEY (date) REFERENCES MeetingDays(date),
		UNIQUE (user_id, date) ON CONFLICT REPLACE
);

CREATE TABLE Meetings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id INT,
    startup_id INT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT NOT NULL,
    coach_rating INT,
    startup_rating INT,
    FOREIGN KEY (coach_id) REFERENCES Users(id),
    FOREIGN KEY (startup_id) REFERENCES Users(id),
		FOREIGN KEY (date) REFERENCES MeetingDays(date)
);

CREATE TABLE MeetingDays(
	date DATE PRIMARY KEY,
	startTime TIME NOT NULL,
	endTime TIME NOT NULL,
	split INT NOT NULL,
	matchmakingDone INT NOT NULL
);

CREATE TABLE Ratings(
    coach_id INT,
    startup_id INT,
    coach_rating INT,
    startup_rating INT,
    FOREIGN KEY (coach_id) REFERENCES Users(id),
    FOREIGN KEY (startup_id) REFERENCES Users(id),
		PRIMARY KEY (coach_id, startup_id)
);
