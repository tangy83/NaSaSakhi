-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 52.56.42.0    Database: sakhi
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

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
-- Table structure for table `regular_users`
--

DROP TABLE IF EXISTS `regular_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regular_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `org_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regular_users`
--

LOCK TABLES `regular_users` WRITE;
/*!40000 ALTER TABLE `regular_users` DISABLE KEYS */;
REPLACE  IGNORE INTO `regular_users` (`id`, `org_name`, `email`, `password`) VALUES (1,'Rajguru','jaypalr100@gmail.com','scrypt:32768:8:1$wkopfs8McZX9MKd7$12c2cca9dc6ed392bb6aae60c3b4db4cc6ea236ed42053c3887ad4a92b9931f5a34ffa9ead46b9dc1f4f6aa753df89a032a1fc8a52197bed0132b9183c439075'),(4,'sam','sam@gmail.com','scrypt:32768:8:1$gtjQCGki9khIBXrI$dc3bb1df66df96f0b4f8a5e05e9e097ce19d0319d7578681cf027ec02bee6a996d96f59ff1decc9fa0cb89a5bcefdcfe5d95b694b83512f997c48d130531aa5d'),(6,'jay','jaypalr1000@gmal.com','scrypt:32768:8:1$BSf7lPfMd3rNHKRp$eaaafb840ebb09bf2412391d342727b70e8a99da642531d2987bd2d9191a68169c3b9096f25e43546e1409558e3f59c2233785309d4abdf421db8409974ca6d9');
/*!40000 ALTER TABLE `regular_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 18:44:59
