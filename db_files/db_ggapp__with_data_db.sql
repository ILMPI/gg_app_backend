CREATE DATABASE  IF NOT EXISTS `ggapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ggapp`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: ggapp
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `expense_assignments`
--

DROP TABLE IF EXISTS `expense_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_assignments` (
  `expense_asign_id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `expenses_id` int NOT NULL,
  `group_id` int NOT NULL,
  `cost` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Reported','Accepted','Paid','Rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`expense_asign_id`),
  KEY `fk_users_has_expenses_expenses1_idx` (`expenses_id`),
  KEY `fk_users_has_expenses_users1_idx` (`users_id`),
  CONSTRAINT `fk_users_has_expenses_expenses1` FOREIGN KEY (`expenses_id`) REFERENCES `expenses` (`expense_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_has_expenses_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_assignments`
--

LOCK TABLES `expense_assignments` WRITE;
/*!40000 ALTER TABLE `expense_assignments` DISABLE KEYS */;
INSERT INTO `expense_assignments` VALUES (1,1,1,4,'42.857142857142854','Paid'),(2,2,1,4,'42.857142857142854','Reported'),(3,3,1,4,'42.857142857142854','Reported'),(4,4,1,4,'42.857142857142854','Reported'),(5,5,1,4,'42.857142857142854','Reported'),(6,6,1,4,'42.857142857142854','Reported'),(7,7,1,4,'42.857142857142854','Reported'),(8,1,2,4,'10','Reported'),(9,2,2,4,'10','Reported'),(10,3,2,4,'10','Reported'),(11,4,2,4,'10','Reported'),(12,5,2,4,'10','Reported'),(13,6,2,4,'10','Reported'),(14,7,2,4,'10','Paid');
/*!40000 ALTER TABLE `expense_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `expense_id` int NOT NULL AUTO_INCREMENT,
  `groups_id` int NOT NULL,
  `concept` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` datetime DEFAULT NULL,
  `max_date` datetime DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payer_user_id` int NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`expense_id`),
  KEY `fk_expenses_groups1_idx` (`groups_id`),
  KEY `fk_expenses_membership1_idx` (`payer_user_id`),
  CONSTRAINT `fk_expenses_groups1` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_expenses_membership1` FOREIGN KEY (`payer_user_id`) REFERENCES `membership` (`users_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,4,'Cena en La Trattoria da Luigi',300.00,'2024-06-16 14:00:00','2024-07-05 14:00:00',NULL,1,'2024-06-16 23:45:45'),(2,4,'Taller de Excel',70.00,'2024-06-01 19:30:00','2024-07-01 14:00:00',NULL,7,'2024-06-16 23:48:30');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_states`
--

DROP TABLE IF EXISTS `group_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('Active','Archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_on` datetime NOT NULL,
  `groups_id` int NOT NULL,
  PRIMARY KEY (`id`,`groups_id`),
  KEY `fk_group_states_groups1_idx` (`groups_id`),
  CONSTRAINT `fk_group_states_groups1` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_states`
--

LOCK TABLES `group_states` WRITE;
/*!40000 ALTER TABLE `group_states` DISABLE KEYS */;
INSERT INTO `group_states` VALUES (1,'Active','2024-06-17 07:06:31',1),(2,'Active','2024-06-17 07:06:35',2),(3,'Active','2024-06-17 07:06:37',3),(4,'Active','2024-06-17 07:06:40',4);
/*!40000 ALTER TABLE `group_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_groups_users_idx` (`creator_id`),
  CONSTRAINT `fk_groups_users` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,1,'Grupo de Juan','Grupo creado por Juan Pére',NULL,'2024-06-16 22:54:59'),(2,2,'Grupo de María','Grupo creado por María López',NULL,'2024-06-16 22:57:43'),(3,5,'Grupo de Luis','Grupo creado por Luis Martínez',NULL,'2024-06-16 23:10:01'),(4,7,'Amantes de la administración','Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.',NULL,'2024-06-16 23:16:11');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `groups_id` int NOT NULL,
  `status` enum('Sent','Accepted','Declined') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_on` datetime NOT NULL,
  `responded_on` datetime DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Invitations_users1_idx` (`users_id`),
  KEY `fk_Invitations_groups1_idx` (`groups_id`),
  CONSTRAINT `fk_Invitations_groups1` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `fk_Invitations_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership`
--

DROP TABLE IF EXISTS `membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership` (
  `membership_id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `groups_id` int NOT NULL,
  `status` enum('Invited','Joined') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `balance` decimal(10,0) NOT NULL,
  PRIMARY KEY (`membership_id`),
  KEY `fk_users_has_groups_groups1_idx` (`groups_id`),
  KEY `fk_users_has_groups_users1_idx` (`users_id`),
  CONSTRAINT `fk_users_has_groups_groups1` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_has_groups_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership`
--

LOCK TABLES `membership` WRITE;
/*!40000 ALTER TABLE `membership` DISABLE KEYS */;
INSERT INTO `membership` VALUES (1,1,4,'Joined',247),(2,2,4,'Joined',-53),(3,3,4,'Joined',-53),(4,4,4,'Joined',-53),(5,5,4,'Joined',-53),(6,6,4,'Joined',-53),(7,7,4,'Joined',17),(8,7,1,'Joined',0),(9,7,2,'Joined',0),(10,7,3,'Joined',0);
/*!40000 ALTER TABLE `membership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `status` enum('Read','Unread') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notificaciones_users1_idx` (`users_id`),
  CONSTRAINT `fk_notificaciones_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'Unread','2024-06-16 23:17:00','Añadido al grupo Amantes de la administración','Ahora debes confirmar que aceptas estar en el grupo'),(2,2,'Unread','2024-06-16 23:17:00','Añadido al grupo Amantes de la administración','Ahora debes confirmar que aceptas estar en el grupo'),(3,3,'Unread','2024-06-16 23:17:00','Añadido al grupo Amantes de la administración','Ahora debes confirmar que aceptas estar en el grupo'),(4,4,'Unread','2024-06-16 23:17:00','Añadido al grupo Amantes de la administración','Ahora debes confirmar que aceptas estar en el grupo'),(5,5,'Unread','2024-06-16 23:17:00','Añadido al grupo Amantes de la administración','Ahora debes confirmar que aceptas estar en el grupo'),(6,6,'Unread','2024-06-16 23:17:00','Añadido al grupo Amantes de la administración','Ahora debes confirmar que aceptas estar en el grupo'),(7,7,'Unread','2024-06-16 23:18:00','Añadido al grupo Amantes de la administración','Ahora debes confirmar que aceptas estar en el grupo');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` enum('Active','NotActive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'$2a$10$LVUQ3sHdrqbw8uMQ9W6Z3OSuDS/jdGX08NJUwq3MVkBgd0Yg1Sbqa','Juan Pérez','juan.perez@gmail.com',NULL,'Active'),(2,'$2a$10$DYsd3hW4GEX2iYF2IcT9BuRihkgbTWg7m9zedCoui4Iryn.BrwpqO','María López','maria.lopez@example.com',NULL,'Active'),(3,'$2a$10$PGuVIA2WU0QEX80DrIpAUOEu1On4G8S.nrs6lQ/stJa0l6PaRNd3m','Carlos García','carlos.garcia@yahoo.com',NULL,'Active'),(4,'$2a$10$BRgVlOB3ipaMAu14ZQhyGevaXpXvIFfI8NVfm6PWQlo.DoeQPUbqW','Ana Fernández','ana.fernandez@example.com',NULL,'Active'),(5,'$2a$10$utPVEJo4phtnLkEcqjLddOZQ4hUuymK4iOpG/2.VGkMLZsDBm1J3W','Luis Martínez','luis.martinez@gmail.com',NULL,'Active'),(6,'$2a$10$Y7nSEtfqXddvAS1UiJJ6GOaMN9gOOMAKh0TWzHjv0Uw2AcxyYGBki','Marina Garcia','marina.garcia@gmail.com',NULL,'Active'),(7,'$2a$10$2bu2sE9SI4w6dmixjbwSSOJ2GWsMQF7kB8ELpQD0k4AmUmBhqViuW','admin','admin@gmail.com',NULL,'Active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-17 18:08:34
