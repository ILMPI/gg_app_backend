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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_assignments`
--

LOCK TABLES `expense_assignments` WRITE;
/*!40000 ALTER TABLE `expense_assignments` DISABLE KEYS */;
INSERT INTO `expense_assignments` VALUES (1,2,1,1,'50.25','Reported'),(2,3,1,1,'50.25','Reported'),(3,2,2,1,'100.375','Reported'),(4,3,2,1,'100.375','Reported'),(5,1,3,2,'75.00','Reported'),(6,4,3,2,'75.00','Reported'),(7,1,4,2,'37.65','Reported'),(8,4,4,2,'37.65','Reported'),(9,5,5,3,'25.00','Reported'),(10,4,5,3,'25.00','Reported'),(11,5,6,3,'150.00','Reported'),(12,4,6,3,'150.00','Reported'),(13,3,7,4,'60.00','Reported'),(14,5,7,4,'60.00','Reported'),(15,3,8,4,'90.00','Reported'),(16,5,8,4,'90.00','Reported'),(17,1,9,5,'125.00','Reported'),(18,2,9,5,'125.00','Reported'),(19,1,10,5,'45.00','Reported'),(20,2,10,5,'45.00','Reported');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,1,'Compra de material',100.50,'2024-06-15 00:35:21',NULL,NULL,2,'2024-06-15 00:35:21'),(2,1,'Pago de servicio',200.75,'2024-06-15 00:35:21',NULL,NULL,3,'2024-06-15 00:35:21'),(3,2,'Alquiler de sala',150.00,'2024-06-15 00:35:21',NULL,NULL,1,'2024-06-15 00:35:21'),(4,2,'Compra de comida',75.30,'2024-06-15 00:35:21',NULL,NULL,4,'2024-06-15 00:35:21'),(5,3,'Transporte',50.00,'2024-06-15 00:35:21',NULL,NULL,5,'2024-06-15 00:35:21'),(6,3,'Equipos de sonido',300.00,'2024-06-15 00:35:21',NULL,NULL,4,'2024-06-15 00:35:21'),(7,4,'Decoraciones',120.00,'2024-06-15 00:35:21',NULL,NULL,3,'2024-06-15 00:35:21'),(8,4,'Publicidad',180.00,'2024-06-15 00:35:21',NULL,NULL,5,'2024-06-15 00:35:21'),(9,5,'Servicio de catering',250.00,'2024-06-15 00:35:21',NULL,NULL,1,'2024-06-15 00:35:21'),(10,5,'Artículos promocionales',90.00,'2024-06-15 00:35:21',NULL,NULL,2,'2024-06-15 00:35:21');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_states`
--

LOCK TABLES `group_states` WRITE;
/*!40000 ALTER TABLE `group_states` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,1,'Grupo de Juan','Grupo creado por Juan Pérez',NULL,'2024-06-15 00:35:21'),(2,2,'Grupo de María','Grupo creado por María López',NULL,'2024-06-15 00:35:21'),(3,3,'Grupo de Carlos','Grupo creado por Carlos García',NULL,'2024-06-15 00:35:21'),(4,4,'Grupo de Ana','Grupo creado por Ana Fernández',NULL,'2024-06-15 00:35:21'),(5,5,'Grupo de Luis','Grupo creado por Luis Martínez',NULL,'2024-06-15 00:35:21'),(6,7,'Familia','Celebramos la abuela cumple 90!','https://placehold.co/200x200','2024-06-15 00:35:21'),(7,7,'Compañeros de EGB','Qué bien lo pasamos','','2024-06-15 00:35:21'),(8,7,'Padel 2024','Padel domingueros 2024','','2024-06-15 00:35:21'),(9,7,'Nuevo grupo','Descr grupo','','2024-06-15 00:35:21'),(10,7,'Otro','Otro desc','','2024-06-15 00:35:21');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership`
--

LOCK TABLES `membership` WRITE;
/*!40000 ALTER TABLE `membership` DISABLE KEYS */;
INSERT INTO `membership` VALUES (1,2,1,'Joined',0),(2,3,1,'Joined',0),(3,1,2,'Joined',0),(4,4,2,'Joined',0),(5,5,3,'Joined',0),(6,4,3,'Joined',0),(7,3,4,'Joined',0),(8,5,4,'Joined',0),(9,1,5,'Joined',0),(10,2,5,'Joined',0),(11,6,6,'Joined',0);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
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
INSERT INTO `users` VALUES (1,'password1','Juan Pérez','juan.perez@example.com','https://picsum.photos/id/91/200/300','Active'),(2,'password2','María López','maria.lopez@example.com','https://picsum.photos/id/64/200/300','Active'),(3,'password3','Carlos García','carlos.garcia@example.com','https://picsum.photos/id/40/200/300','Active'),(4,'password4','Ana Fernández','ana.fernandez@example.com','https://picsum.photos/id/65/200/300','Active'),(5,'password5','Luis Martínez','luis.martinez@example.com','https://picsum.photos/id/63/200/300','Active'),(6,'password54','Marina Garcia','marina.garcia@example.com','https://picsum.photos/id/82/200/300','Active'),(7,'admin','admin','admin@gmail.com','https://picsum.photos/id//200/300','Active');
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

-- Dump completed on 2024-06-15  0:39:00
