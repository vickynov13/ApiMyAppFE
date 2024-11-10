-- MySQL dump 10.16  Distrib 10.1.48-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: db
-- ------------------------------------------------------
-- Server version	10.1.48-MariaDB-0+deb9u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `All_MESSAGES`
--

DROP TABLE IF EXISTS `All_MESSAGES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `All_MESSAGES` (
  `id` tinyint(4) DEFAULT NULL,
  `short_msg` varchar(17) DEFAULT NULL,
  `long_msg` varchar(23) DEFAULT NULL,
  `status` varchar(4) DEFAULT NULL,
  `secret` varchar(5) DEFAULT NULL,
  `receiver` varchar(8) DEFAULT NULL,
  `sender` varchar(8) DEFAULT NULL,
  `added_dt` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `All_MESSAGES`
--

LOCK TABLES `All_MESSAGES` WRITE;
/*!40000 ALTER TABLE `All_MESSAGES` DISABLE KEYS */;
INSERT INTO `All_MESSAGES` VALUES (1,'General Message','type: self, by:Vignesh','Done','false','vignesh','vignesh','2020-07-12'),(2,'Secret','type:self, by:vignesh','ToDo','true','vignesh','vignesh','2020-07-12'),(3,'General Message','type:self, by:vedha','Done','false','vvedha','vvedha','2020-07-12'),(4,'Secret','type:self, by:vedha','ToDo','true','vvedha','vvedha','2020-07-12'),(5,'General Message','use self, by arniveth','Done','false','arniveth','arniveth','2020-07-14'),(6,'secret message','use self, by arniveth','ToDo','true','arniveth','arniveth','2020-07-14'),(7,'General Message','to vignesh, by arniveth','Done','false','vignesh','arniveth','2020-07-14'),(8,'secret Message','to vignesh, by arniveth','Done','true','vignesh','arniveth','2020-07-14'),(9,'General message 2','Self by vignesh','ToDo','false','vignesh','vignesh','2020-07-15');
/*!40000 ALTER TABLE `All_MESSAGES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MEDIA_INFO`
--

DROP TABLE IF EXISTS `MEDIA_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MEDIA_INFO` (
  `id` varchar(0) DEFAULT NULL,
  `photo_name` varchar(0) DEFAULT NULL,
  `lq_photoname` varchar(0) DEFAULT NULL,
  `uploaded_by` varchar(0) DEFAULT NULL,
  `added_dte` varchar(0) DEFAULT NULL,
  `location` varchar(0) DEFAULT NULL,
  `occation` varchar(0) DEFAULT NULL,
  `person1` varchar(0) DEFAULT NULL,
  `person2` varchar(0) DEFAULT NULL,
  `tag5` varchar(0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MEDIA_INFO`
--

LOCK TABLES `MEDIA_INFO` WRITE;
/*!40000 ALTER TABLE `MEDIA_INFO` DISABLE KEYS */;
/*!40000 ALTER TABLE `MEDIA_INFO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MENU_ITEMS`
--

DROP TABLE IF EXISTS `MENU_ITEMS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MENU_ITEMS` (
  `menu_id` tinyint(4) DEFAULT NULL,
  `menu_name` varchar(16) DEFAULT NULL,
  `menu_navpath` varchar(10) DEFAULT NULL,
  `display_flag` varchar(1) DEFAULT NULL,
  `priority` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MENU_ITEMS`
--

LOCK TABLES `MENU_ITEMS` WRITE;
/*!40000 ALTER TABLE `MENU_ITEMS` DISABLE KEYS */;
INSERT INTO `MENU_ITEMS` VALUES (1,'Home','','Y',100),(2,'Numerology','numerology','Y',10),(4,'Login / Register','login','Y',0),(5,'Chat','chat','N',2),(6,'Board','dash','Y',90);
/*!40000 ALTER TABLE `MENU_ITEMS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERACCESS_INFO`
--

DROP TABLE IF EXISTS `USERACCESS_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USERACCESS_INFO` (
  `id` tinyint(4) DEFAULT NULL,
  `p_username` varchar(8) DEFAULT NULL,
  `g_username` varchar(8) DEFAULT NULL,
  `accesstype` varchar(5) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERACCESS_INFO`
--

LOCK TABLES `USERACCESS_INFO` WRITE;
/*!40000 ALTER TABLE `USERACCESS_INFO` DISABLE KEYS */;
INSERT INTO `USERACCESS_INFO` VALUES (20,'vignesh','arniveth','MEDIA','C'),(21,'vignesh','arniveth','LIST','C'),(23,'vignesh','vvedha','MEDIA','C'),(24,'vignesh','vvedha','LIST','C'),(26,'vvedha','arniveth','LIST','C'),(27,'vvedha','vignesh','MEDIA','C'),(28,'vvedha','arniveth','MEDIA','C'),(29,'arniveth','vignesh','LIST','C'),(30,'arniveth','vvedha','LIST','C'),(31,'arniveth','vignesh','MEDIA','C'),(32,'arniveth','vvedha','MEDIA','C'),(33,'vvedha','vignesh','LIST','C');
/*!40000 ALTER TABLE `USERACCESS_INFO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_INFO`
--

DROP TABLE IF EXISTS `USER_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USER_INFO` (
  `id` tinyint(4) DEFAULT NULL,
  `fname` varchar(10) DEFAULT NULL,
  `lname` varchar(11) DEFAULT NULL,
  `mobile` bigint(20) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  `username` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_INFO`
--

LOCK TABLES `USER_INFO` WRITE;
/*!40000 ALTER TABLE `USER_INFO` DISABLE KEYS */;
INSERT INTO `USER_INFO` VALUES (1,'Vignesh','Praabakaran',1111111111,'vickynov13@gmail.com','vignesh'),(2,'Vedha','Vignesh',1111111111,'vedha@home.abc','vvedha'),(3,'Nivethitha','Vignesh',1111111111,'arniveth17@gmail.com','arniveth');
/*!40000 ALTER TABLE `USER_INFO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_LOGIN_INFO`
--

DROP TABLE IF EXISTS `USER_LOGIN_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USER_LOGIN_INFO` (
  `username` varchar(8) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `sessionkey` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_LOGIN_INFO`
--

LOCK TABLES `USER_LOGIN_INFO` WRITE;
/*!40000 ALTER TABLE `USER_LOGIN_INFO` DISABLE KEYS */;
INSERT INTO `USER_LOGIN_INFO` VALUES ('vignesh','vignesh','bdz4j2eyddw1661c4eecbfd4d1a1594914357763'),('vvedha','vvedha','gx7fifq9ea4c095089da4bfe88c1641700202109'),('arniveth','arniveth','s9f3s38qael04ad4b02243f56291598443752605');
/*!40000 ALTER TABLE `USER_LOGIN_INFO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sqlite_sequence`
--

DROP TABLE IF EXISTS `sqlite_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sqlite_sequence` (
  `name` varchar(15) DEFAULT NULL,
  `seq` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sqlite_sequence`
--

LOCK TABLES `sqlite_sequence` WRITE;
/*!40000 ALTER TABLE `sqlite_sequence` DISABLE KEYS */;
INSERT INTO `sqlite_sequence` VALUES ('MENU_ITEMS',0),('USER_INFO',3),('All_MESSAGES',9),('MEDIA_INFO',25),('USERACCESS_INFO',33);
/*!40000 ALTER TABLE `sqlite_sequence` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-30 16:42:43
