-- TIETOKANNAN JA TAULUJEN LUONTIKYSELYT

CREATE DATABASE sauna_db;

USE sauna_db;

CREATE TABLE Batches(
    id INT PRIMARY KEY
);

CREATE TABLE Users(
    id INT PRIMARY KEY,
    type INT NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    password CHAR(64) NOT NULL,
    batch INT,
    active BOOLEAN NOT NULL,
    FOREIGN KEY (batch) REFERENCES Batches(id)
);

CREATE TABLE Profiles(
    user_id INT,
    name VARCHAR(30) NOT NULL,
    description TEXT,
    company VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    linkedin VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(id)

);

CREATE TABLE Credentials(
    user_id INT,
    company VARCHAR(20) NOT NULL,
    title VARCHAR(30) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT pk_credentials PRIMARY KEY(user_id, company, title)
);

CREATE TABLE Timeslots(
    id INT PRIMARY KEY,
    user_id INT,
    datetime DATETIME NOT NULL,
    duration INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Meetings(
    id INT PRIMARY KEY,
    coach_id INT,
    startup_id INT,
    datetime DATETIME NOT NULL,
    duration INT NOT NULL,
    coach_rating INT,
    startup_rating INT,
    FOREIGN KEY (coach_id) REFERENCES Users(id),
    FOREIGN KEY (startup_id) REFERENCES Users(id)
);