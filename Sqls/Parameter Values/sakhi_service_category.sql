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
-- Table structure for table `service_category`
--

DROP TABLE IF EXISTS `service_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_category` (
  `CategoryID` varchar(10) NOT NULL,
  `Service_Group` varchar(1) NOT NULL,
  `LanguageID` varchar(4) NOT NULL,
  `Category_Description` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`CategoryID`,`Service_Group`,`LanguageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_category`
--

LOCK TABLES `service_category` WRITE;
/*!40000 ALTER TABLE `service_category` DISABLE KEYS */;
REPLACE  IGNORE INTO `service_category` (`CategoryID`, `Service_Group`, `LanguageID`, `Category_Description`) VALUES ('C001','C','enuk','Health & Well-being'),('C002','C','enuk','Education & Skill Development'),('C003','C','enuk','Child Protection & Rights'),('C004','C','enuk','Shelter & Basic Needs'),('C005','C','enuk','Economic & Social Empowerment'),('C006','C','enuk','Gender & Inclusion'),('C007','C','enuk','Safety & Emergency Response'),('C008','C','enuk','Environment & Sustainability Education'),('W001','W','enuk','Health & Well-being'),('W002','W','enuk','Education & Skills Development'),('W003','W','enuk','Economic Empowerment'),('W004','W','enuk','Legal & Human Rights'),('W005','W','enuk','Safety & Shelter'),('W006','W','enuk','Social Support & Community Building'),('W007','W','enuk','Environmental & Rural Development');
/*!40000 ALTER TABLE `service_category` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 18:44:45
