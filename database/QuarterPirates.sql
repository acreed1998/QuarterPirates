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

ALTER TABLE UserTreasures ADD FOREIGN KEY (iduser) REFERENCES Users (id);
ALTER TABLE UserTreasures ADD FOREIGN KEY (idtreasure) REFERENCES Treasures (id);
ALTER TABLE UserRiddles ADD FOREIGN KEY (iduser) REFERENCES Users (id);
ALTER TABLE UserRiddles ADD FOREIGN KEY (idriddle) REFERENCES Riddles (id);
ALTER TABLE TreasureRiddles ADD FOREIGN KEY (idtreasure) REFERENCES Treasures (id);
ALTER TABLE TreasureRiddles ADD FOREIGN KEY (idriddle) REFERENCES Riddles (id);

-- ---
-- Foreign Keys 
-- ---
-- ALTER TABLE `Dislikes` ADD FOREIGN KEY (idUsers) REFERENCES `Users` (`id`);
-- ALTER TABLE `Dislikes` ADD FOREIGN KEY (idRecipes) REFERENCES `Recipes ` (`id`);
-- ALTER TABLE `Saved` ADD FOREIGN KEY (idUsers) REFERENCES `Users` (`id`);
-- ALTER TABLE `Saved` ADD FOREIGN KEY (idRecipes) REFERENCES `Recipes ` (`id`);
-- ALTER TABLE `Recipe of the Day` ADD FOREIGN KEY (idRecipe) REFERENCES `Recipes ` (`id`);
-- ALTER TABLE `recipe's ingredients` ADD FOREIGN KEY (idRecipes) REFERENCES `Recipes ` (`id`);
-- ALTER TABLE `recipe's ingredients` ADD FOREIGN KEY (idIngredients) REFERENCES `Ingredients` (`id`);
-- ---
-- Table Properties
-- ---
-- ALTER TABLE `Users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Recipes ` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Ingredients` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Dislikes` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Saved` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Recipe of the Day` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `recipe's ingredients` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ---
-- Test Data
-- ---
-- INSERT INTO `Users` (`id`,`username`,`password`) VALUES
-- ('','','');
-- INSERT INTO `Recipes ` (`id`,`recipe`,`idRecipieFoodNutrition`) VALUES
-- ('','','');
-- INSERT INTO `Ingredients` (`id`,`ingredient`) VALUES
-- ('','');
-- INSERT INTO `Dislikes` (`id`,`idUsers`,`idRecipes`) VALUES
-- ('','','');
-- INSERT INTO `Saved` (`id`,`idUsers`,`idRecipes`) VALUES
-- ('','','');
-- INSERT INTO `Recipe of the Day` (`id`,`link`,`idRecipe`) VALUES
-- ('','','');
-- INSERT INTO `recipe's ingredients` (`id`,`idRecipes`,`idIngredients`) VALUES
-- ('','','');```