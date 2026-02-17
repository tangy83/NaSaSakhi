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
-- Table structure for table `social_category`
--

DROP TABLE IF EXISTS `social_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `social_category` (
  `Social_CategoryID` varchar(6) NOT NULL,
  `LanguageID` varchar(4) NOT NULL,
  `Social_Category_Name` varchar(45) NOT NULL,
  PRIMARY KEY (`Social_CategoryID`,`LanguageID`),
  UNIQUE KEY `Social_Category_Name_UNIQUE` (`Social_Category_Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_category`
--

LOCK TABLES `social_category` WRITE;
/*!40000 ALTER TABLE `social_category` DISABLE KEYS */;
REPLACE  IGNORE INTO `social_category` (`Social_CategoryID`, `LanguageID`, `Social_Category_Name`) VALUES ('BC','enuk','Backward Class'),('EWS','enuk','Economically Weaker Section'),('GC','enuk','General Class'),('OBC','enuk','Other Backward Class'),('SC','enuk','Scheduled Caste'),('ST','enuk','Scheduled Tribe'),('SC','hind','अनुसूचित जातियाँ'),('SC','tata','நிகழ்த்தப்பட்ட மக்கள்'),('SC','tete','షెడ్యూల్డ్ కాస్ట్స్'),('SC','sant','ᱯᱩᱛᱩᱱ ᱜᱟᱣᱟᱨᱜᱟᱹᱧ ᱞᱮᱥᱮᱥᱮᱱ ᱟᱝᱛ ᱛᱟᱹᱨᱜᱟᱜᱟᱜ');
/*!40000 ALTER TABLE `social_category` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 18:44:50
