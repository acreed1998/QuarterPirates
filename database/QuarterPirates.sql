DROP DATABASE IF EXISTS pirates;
CREATE DATABASE pirates;
-- command for root user and no password
-- mysql -u root < database/QuarterPirates.sql
-- DROP TABLE IF EXISTS Users;

USE pirates;

CREATE TABLE Users (
  id INTEGER AUTO_INCREMENT NOT NULL,
  username VARCHAR(50) NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  gold INTEGER NOT NULL DEFAULT 1000,
  avatar TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Riddles (
  id INTEGER AUTO_INCREMENT NOT NULL,
  longitude FLOAT(11) NOT NULL,
  latitude FLOAT(11) NOT NULL,
  address TEXT NOT NULL,
  zipcode INTEGER NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  date_created TEXT NOT NULL,
  time_created INTEGER NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  riddle TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Treasures(
  id INTEGER AUTO_INCREMENT NOT NULL,
  gold_value INTEGER NOT NULL,
  longitude FLOAT(11) NOT NULL,
  latitude FLOAT(11) NOT NULL,
  address TEXT NOT NULL,
  zipcode INTEGER NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  date_created TEXT NOT NULL,
  date_claimed TEXT NOT NULL,
  time_created INTEGER NOT NULL,
  time_claimed INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE UserRiddles(
  id INTEGER AUTO_INCREMENT NOT NULL,
  iduser INTEGER NOT NULL,
  idriddle INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE UserTreasures(
  id INTEGER AUTO_INCREMENT NOT NULL,
  iduser INTEGER NOT NULL,
  idtreasure INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE TreasureRiddles(
  id INTEGER AUTO_INCREMENT NOT NULL,
  idtreasure INTEGER NOT NULL,
  idriddle INTEGER NOT NULL,
  PRIMARY KEY (id)
);
