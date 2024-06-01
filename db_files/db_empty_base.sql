-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `state` ENUM("Active", "NotActive") NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`groups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `creator_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `image_url` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_groups_users_idx` (`creator_id` ASC) VISIBLE,
  CONSTRAINT `fk_groups_users`
    FOREIGN KEY (`creator_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`membership`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`membership` (
  `users_id` INT NOT NULL,
  `groups_id` INT NOT NULL,
  `status` ENUM('Invited', 'Joined') NOT NULL,
  PRIMARY KEY (`users_id`, `groups_id`),
  INDEX `fk_users_has_groups_groups1_idx` (`groups_id` ASC) VISIBLE,
  INDEX `fk_users_has_groups_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_has_groups_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_groups_groups1`
    FOREIGN KEY (`groups_id`)
    REFERENCES `mydb`.`groups` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`expenses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`expenses` (
  `id` INT NOT NULL,
  `groups_id` INT NOT NULL,
  `concept` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `date` DATETIME NULL,
  `max_date` DATETIME NULL,
  `image_url` VARCHAR(255) NULL,
  `membership_users_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_expenses_groups1_idx` (`groups_id` ASC) VISIBLE,
  INDEX `fk_expenses_membership1_idx` (`membership_users_id` ASC) VISIBLE,
  CONSTRAINT `fk_expenses_groups1`
    FOREIGN KEY (`groups_id`)
    REFERENCES `mydb`.`groups` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_expenses_membership1`
    FOREIGN KEY (`membership_users_id`)
    REFERENCES `mydb`.`membership` (`users_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`expense_assignments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`expense_assignments` (
  `users_id` INT NOT NULL,
  `expenses_id` INT NOT NULL,
  `assigned_percentage` DECIMAL(5,2) NOT NULL,
  `status` ENUM('Reported', 'Accepted', 'Paid', 'Rechazado') NOT NULL,
  PRIMARY KEY (`users_id`, `expenses_id`),
  INDEX `fk_users_has_expenses_expenses1_idx` (`expenses_id` ASC) VISIBLE,
  INDEX `fk_users_has_expenses_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_has_expenses_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_expenses_expenses1`
    FOREIGN KEY (`expenses_id`)
    REFERENCES `mydb`.`expenses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`group_states`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`group_states` (
  `id` INT NOT NULL,
  `status` ENUM('Active', 'Archived') NOT NULL,
  `changed_on` DATETIME NOT NULL,
  `groups_id` INT NOT NULL,
  PRIMARY KEY (`id`, `groups_id`),
  INDEX `fk_group_states_groups1_idx` (`groups_id` ASC) VISIBLE,
  CONSTRAINT `fk_group_states_groups1`
    FOREIGN KEY (`groups_id`)
    REFERENCES `mydb`.`groups` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`invitations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`invitations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NULL DEFAULT NULL,
  `groups_id` INT NOT NULL,
  `status` ENUM("Sent", "Accepted", "Declined") NOT NULL,
  `sent_on` DATETIME NOT NULL,
  `responded_on` DATETIME NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Invitations_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_Invitations_groups1_idx` (`groups_id` ASC) VISIBLE,
  CONSTRAINT `fk_Invitations_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Invitations_groups1`
    FOREIGN KEY (`groups_id`)
    REFERENCES `mydb`.`groups` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`notifications` (
  `id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `status` ENUM("Read", "Unread") NULL,
  `date` DATETIME NULL,
  `title` VARCHAR(255) NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_notificaciones_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_notificaciones_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
