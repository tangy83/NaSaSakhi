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
-- Table structure for table `service_resource`
--

DROP TABLE IF EXISTS `service_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_resource` (
  `CategoryID` varchar(10) NOT NULL,
  `ResourceID` varchar(10) NOT NULL,
  `Service_Group` varchar(1) NOT NULL,
  `LanguageID` varchar(4) NOT NULL,
  `Resource_Description` varchar(150) NOT NULL,
  PRIMARY KEY (`CategoryID`,`ResourceID`,`Service_Group`,`LanguageID`),
  UNIQUE KEY `Resource_Description_UNIQUE` (`Resource_Description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_resource`
--

LOCK TABLES `service_resource` WRITE;
/*!40000 ALTER TABLE `service_resource` DISABLE KEYS */;
REPLACE  IGNORE INTO `service_resource` (`CategoryID`, `ResourceID`, `Service_Group`, `LanguageID`, `Resource_Description`) VALUES ('C003','CR0032','C','enuk','Anti-Trafficking & Exploitation Programs (awareness, rescue operations)'),('W004','WR0045','W','enuk','Child & Forced Marriage Prevention (legal action, awareness campaigns)'),('C003','CR0031','C','enuk','Child Abuse Prevention & Response (helplines, legal aid, safe spaces)'),('C003','CR0034','C','enuk','Child-friendly Legal Support (advocacy for birth registration, legal rights)'),('W004','WR0046','W','enuk','Citizenship & Documentation Support (ID cards, birth certificates, legal status)'),('W007','WR0072','W','enuk','Clean Water & Sanitation (hygiene awareness, access to safe drinking water)'),('C008','CR0084','C','enuk','Clean Water & Sanitation Programs (hygiene kits, access to safe drinking water)'),('W007','WR0073','W','enuk','Climate Change & Womenâ€™s Rights (eco-activism, climate resilience training)'),('C008','CR0083','C','enuk','Climate Change Awareness for Kids (interactive workshops, action projects)'),('W005','WR0056','W','enuk','Community Watch Programs (women-led safety initiatives)'),('C007','CR0073','C','enuk','Conflict-Affected Children Programs (rehabilitation, reintegration support)'),('W005','WR0055','W','enuk','Crisis Helplines (24/7 support for violence victims)'),('W002','WR0024','W','enuk','Digital Literacy (computer skills, online safety, social media training)'),('C002','CR0026','C','enuk','Disability & Special Needs Support (inclusive education, therapy, assistive devices)'),('C007','CR0071','C','enuk','Disaster Preparedness & Relief for Children (safe zones, trauma care)'),('C001','CR0012','C','enuk','Disease Prevention & Treatment (vaccination drives, hygiene awareness)'),('W005','WR0052','W','enuk','Domestic Violence Shelters (safe houses, emergency housing)'),('C002','CR0021','C','enuk','Early Childhood Education (preschool programs, daycare centers)'),('C008','CR0082','C','enuk','Eco-Schools & Green Learning Spaces (gardening, recycling programs)'),('W006','WR0063','W','enuk','Elderly Women Support (healthcare, social engagement programs)'),('C007','CR0074','C','enuk','Emergency Shelters for Abandoned or At-Risk Children (temporary homes, foster homes)'),('W003','WR0031','W','enuk','Entrepreneurship Support (business training, startup grants, mentorship)'),('W004','WR0041','W','enuk','Fair Wages & Workersâ€™ Rights (awareness, legal assistance, advocacy)'),('C005','CR0051','C','enuk','Financial & Life Skills Training (budgeting, leadership, communication skills)'),('W003','WR0033','W','enuk','Financial Literacy (budgeting, banking, investment skills)'),('C004','CR0043','C','enuk','Food & Clothing Distribution (school meal programs, warm clothing drives)'),('C002','CR0028','C','enuk','Girls\' Education & Empowerment (STEM training, leadership workshops)'),('W003','WR0034','W','enuk','Home-based & Remote Work Opportunities (freelancing, online work training)'),('W003','WR0035','W','enuk','Job Placement & Career Guidance (resume building, interview prep, job matchin'),('C003','CR0033','C','enuk','Juvenile Justice & Legal Aid (rehabilitation, reintegration programs)'),('W004','WR0043','W','enuk','Land & Property Rights (inheritance rights, land ownership support)'),('W003','WR0036','W','enuk','Leadership & Empowerment (public speaking, confidence-building workshops)'),('W004','WR0042','W','enuk','Legal Aid & Representation (domestic abuse, divorce, child custody)'),('W004','WR0047','W','enuk','LGBTQ+ Womenâ€™s Resources (safe spaces, mental health support, legal aid)'),('C002','CR0027','C','enuk','Library & Learning Resource Centers (books, reading programs, homework help)'),('W002','WR0021','W','enuk','Literacy Programs (basic reading & writing skills)'),('C001','CR0014','C','enuk','Maternal & Infant Health (newborn care, breastfeeding support, immunizations)'),('W001','WR0011','W','enuk','Maternal Health (prenatal & postnatal care, breastfeeding support)'),('W001','WR0012','W','enuk','Mental Health (counseling, trauma support, depression & anxiety resources)'),('C001','CR0011','C','enuk','Mental Health & Emotional Support (counseling, trauma therapy, play therapy)'),('W003','WR0032','W','enuk','Microfinance & Loans (small business funding, cooperative banking)'),('C005','CR0054','C','enuk','Microfinance for Young Entrepreneurs (financial aid, savings programs)'),('C001','CR0015','C','enuk','Nutrition & Malnutrition Prevention (feeding programs, vitamin supplements)'),('W001','WR0013','W','enuk','Nutrition & Wellness (healthy eating, fitness programs, disease prevention)'),('C004','CR0041','C','enuk','Orphan & Foster Care Support (adoption services, alternative care models)'),('C005','CR0053','C','enuk','Prevention of Child Labor (advocacy, education support, skill training)'),('C002','CR0022','C','enuk','Primary & Secondary Education (school enrollment drives, scholarships)'),('C002','CR0029','C','enuk','Programs for Disabled Children (inclusive sports, special education services)'),('C007','CR0072','C','enuk','Refugee & Displaced Children Support (education, mental health services)'),('W004','WR0048','W','enuk','Refugee & Migrant Women Support (language classes, resettlement help)'),('W007','WR0074','W','enuk','Renewable Energy Access (solar projects, energy-efficient cooking methods)'),('W001','WR0014','W','enuk','Reproductive Health (family planning, menstrual health, contraception)'),('C005','CR0056','C','enuk','Rural & Indigenous Child Support (language preservation, cultural education)'),('C008','CR0081','C','enuk','Safe Spaces for Play & Recreation (playgrounds, sports clubs, art centers)'),('W005','WR0054','W','enuk','Self-defense Training (martial arts, situational awareness)'),('W005','WR0051','W','enuk','Sexual & Domestic Violence Support (crisis helplines, safe spaces, legal aid)'),('W004','WR0044','W','enuk','Sexual Harassment & Workplace Safety (policy advocacy, case reporting)'),('W006','WR0062','W','enuk','Single Mothersâ€™ Support (daycare, legal aid, financial aid)'),('C002','CR0024','C','enuk','STEM & Digital Literacy (coding, robotics, internet safety)'),('W002','WR0022','W','enuk','STEM Education (scholarships, coding & tech training)'),('C005','CR0052','C','enuk','Street Children & Homelessness Assistance (shelters, rehabilitation programs)'),('C004','CR0042','C','enuk','Street Outreach & Reintegration (counseling, education, family reunification)'),('C001','CR0013','C','enuk','Substance Abuse Prevention (anti-drug programs, peer support groups)'),('W001','WR0015','W','enuk','Substance Abuse Support (addiction recovery programs, rehabilitation centers)'),('C006','CR0061','C','enuk','Support for LGBTQ+ Youth (safe spaces, mental health support)'),('C005','CR0055','C','enuk','Support for Working Children & Families (after-school programs, skill development)'),('W007','WR0071','W','enuk','Sustainable Farming Programs (organic agriculture, eco-friendly practices)'),('W005','WR0053','W','enuk','Transitional Housing (long-term support for homeless or abused women)'),('W002','WR0023','W','enuk','Vocational Training (tailoring, beauty services, agriculture, handicrafts)'),('C002','CR0023','C','enuk','Vocational Training for Youth (carpentry, tailoring, agriculture, mechanics)'),('W006','WR0061','W','enuk','Womenâ€™s Support Groups (peer-to-peer counseling, discussion forums)'),('C002','CR0025','C','enuk','Workplace Readiness Programs (internships, career coaching)'),('C005','CR0057','C','enuk','Youth Entrepreneurship & Job Training (mentorship, startup grants)');
/*!40000 ALTER TABLE `service_resource` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 18:44:55
