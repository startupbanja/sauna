-- Type 0: admin, 1: coach, 2: startup
CREATE TABLE Users(
  id SERIAL PRIMARY KEY,
  type INT NOT NULL,
  email VARCHAR UNIQUE NOT NULL ,
  password VARCHAR NOT NULL,
  active BOOLEAN NOT NULL
);
-- img_url null => user default image
CREATE TABLE Profiles(
  user_id INT PRIMARY KEY REFERENCES Users(id),
  name VARCHAR NOT NULL,
  description VARCHAR DEFAULT '',
  img_url VARCHAR,
  title VARCHAR DEFAULT '',
  website VARCHAR DEFAULT ''
);

CREATE TABLE Credentials(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    company VARCHAR NOT NULL,
    title VARCHAR NOT NULL
);

CREATE TABLE TeamMembers(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    name VARCHAR NOT NULL,
    title VARCHAR NOT NULL
);

-- View that unifies the credentials and members.
CREATE VIEW CredentialsListEntries AS
SELECT user_id, company AS title, title AS content FROM Credentials
  UNION ALL
SELECT user_id, name AS title, title AS content FROM TeamMembers;

CREATE TABLE MeetingDays(
	date DATE PRIMARY KEY,
	startTime TIME NOT NULL,
	endTime TIME NOT NULL,
	split INT NOT NULL,
	matchmakingDone INT NOT NULL
);

CREATE TABLE Timeslots(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    date DATE NOT NULL REFERENCES MeetingDays(date),
    time TIME NOT NULL,
    duration INT NOT NULL,
		UNIQUE (user_id, date)
);

CREATE TABLE Meetings(
    id SERIAL PRIMARY KEY,
    coach_id INT REFERENCES Users(id),
    startup_id INT REFERENCES Users(id),
    date DATE NOT NULL REFERENCES MeetingDays(date),
    time TIME NOT NULL,
    duration INT NOT NULL,
    coach_rating INT,
    startup_rating INT
);

CREATE TABLE Ratings(
    coach_id INT REFERENCES Users(id),
    startup_id INT REFERENCES Users(id),
    coach_rating INT,
    startup_rating INT,
    PRIMARY KEY (coach_id, startup_id)
);
