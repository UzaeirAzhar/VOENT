/*
SQLyog Trial v12.5.0 (64 bit)
MySQL - 5.7.20-log : Database - events
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`events` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `events`;

/*Table structure for table `event_type` */

DROP TABLE IF EXISTS `event_type`;

CREATE TABLE `event_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `event_type` */

insert  into `event_type`(`id`,`Name`) values 
(1,'Education'),
(2,'Cooperate'),
(3,'Organization'),
(4,'Political');

/*Table structure for table `events` */

DROP TABLE IF EXISTS `events`;

CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `event_type` int(11) NOT NULL,
  `sub_type` int(11) NOT NULL,
  `start_date` varchar(50) NOT NULL,
  `end_date` varchar(50) NOT NULL,
  `is_multi` tinyint(1) NOT NULL DEFAULT '0',
  `is_discussion_page` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk2` (`event_type`),
  KEY `fk3` (`sub_type`),
  CONSTRAINT `fk2` FOREIGN KEY (`event_type`) REFERENCES `event_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk3` FOREIGN KEY (`sub_type`) REFERENCES `sub_event_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

/*Data for the table `events` */

insert  into `events`(`id`,`name`,`event_type`,`sub_type`,`start_date`,`end_date`,`is_multi`,`is_discussion_page`,`is_active`) values 
(1,'First',1,2,'2018-01-09 12:35:00','2018-01-10 12:35:08',1,1,1),
(4,'Second',1,4,'2018-01-17 12:35:29','2018-01-18 12:35:33',1,1,1),
(5,'Third',1,5,'2018-01-03 23:29:18','2018-01-04 14:00:00',1,0,1),
(6,'asdf',1,2,'2018-01-04T08:14:00.000Z','2018-01-05T07:11:00.000Z',0,0,1),
(7,'Namaz',1,2,'2018-01-04T08:15:00.000Z','2018-01-04T21:13:00.000Z',0,0,1),
(8,'Testing From UI',1,2,'2018-01-04T19:15:00.000Z','2018-01-06T06:11:00.000Z',1,1,1),
(10,'Testing From UI',1,2,'2018-01-04T19:15:00.000Z','2018-01-06T06:11:00.000Z',1,1,1),
(19,'Testing From UI',1,2,'2017-01-03T19:15:00.000Z','2018-10-04T06:11:00.000Z',1,1,1),
(20,'Hello World',1,2,'2018-01-04T19:15:00.000Z','2018-01-16T06:11:00.000Z',1,0,1),
(21,'Test Event Arafat',1,2,'2018-01-05T21:05:00.000Z','2018-01-05T07:00:00.000Z',0,1,1),
(22,'Test',1,4,'2018-01-05T21:43:00.000Z','2018-01-17T06:11:00.000Z',1,1,1);

/*Table structure for table `options` */

DROP TABLE IF EXISTS `options`;

CREATE TABLE `options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `date` varchar(100) DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL,
  `place` varchar(100) DEFAULT NULL,
  `event_id` int(11) NOT NULL,
  KEY `Index 1` (`id`),
  KEY `FK_options_events` (`event_id`),
  CONSTRAINT `FK_options_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `options` */

insert  into `options`(`id`,`name`,`date`,`time`,`place`,`event_id`) values 
(1,'Bank',NULL,'','',19),
(2,'Hospital',NULL,'','',19),
(3,'Restaurant','2018-01-04T19:00:00.000Z','','',19),
(4,'A',NULL,'','',20),
(5,'B',NULL,'','',20),
(6,'Option 1','2018-01-05T19:00:00.000Z','','Germany',21),
(7,'Option 2','2018-01-05T19:00:00.000Z','','Pakistan',21),
(8,'Option 3','2018-01-05T19:00:00.000Z','','Australia',21),
(9,'1','2018-01-05T19:00:00.000Z','','',22),
(10,'2','2018-01-05T19:00:00.000Z','','',22),
(11,'3','2018-01-05T19:00:00.000Z','','',22),
(12,'4','2018-01-05T19:00:00.000Z','','',22);

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `roles` */

insert  into `roles`(`id`,`name`) values 
(1,'Organizer'),
(2,'Participant_Discussion');

/*Table structure for table `sub_event_type` */

DROP TABLE IF EXISTS `sub_event_type`;

CREATE TABLE `sub_event_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL DEFAULT '0',
  `event_type_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk` (`event_type_id`),
  CONSTRAINT `fk` FOREIGN KEY (`event_type_id`) REFERENCES `event_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

/*Data for the table `sub_event_type` */

insert  into `sub_event_type`(`id`,`Name`,`event_type_id`) values 
(2,'Project Meeting',1),
(4,'Hangout',1),
(5,'Meeting',2),
(10,'Company Events',2),
(11,'Committee Selection Voting',3),
(12,'Activities',3),
(13,'Member Voting',4);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `name` varchar(100) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT '0',
  `password` varchar(100) DEFAULT '0',
  `gender` enum('Male','Female') DEFAULT 'Male',
  `phone` varchar(50) DEFAULT '0',
  `address` varchar(250) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`name`,`id`,`email`,`password`,`gender`,`phone`,`address`,`is_active`) values 
('Ali',1,'email@gmail.com','148fc783367e6a74','Male','123456','address',1),
('asdasd',2,'asd@gmail.com','059dd091327579','Male','123','asdasd',1),
('asdasd',3,'asd1@gmail.com','059dd091327579','Male','123','asdasd',1),
('asdasd',4,'asd21@gmail.com','059dd091327579','Male','123','asdasd',1),
('ali',5,'ali@gmail.com','0582dd','Male','123456','ali house',1),
('gmail',6,'gmail@gmail.com','0383d5992d','Male','123456','gmail address',1),
('ali',7,'ali2@gmail.com','0582dd','Male','123456','ali',1),
('arafat',8,'arafat@gmail.com','55dc87','Male','12345678','Germany',1);

/*Table structure for table `user_event_option` */

DROP TABLE IF EXISTS `user_event_option`;

CREATE TABLE `user_event_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `event_id` int(11) NOT NULL DEFAULT '0',
  `option_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_user_event_option_user` (`user_id`),
  KEY `FK_user_event_option_events` (`event_id`),
  KEY `FK_user_event_option_options` (`option_id`),
  CONSTRAINT `FK_user_event_option_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_user_event_option_options` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_user_event_option_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `user_event_option` */

insert  into `user_event_option`(`id`,`user_id`,`event_id`,`option_id`) values 
(1,7,20,4),
(2,7,20,5),
(3,8,22,9),
(4,8,22,10),
(5,8,22,11),
(6,8,22,12),
(7,7,22,9),
(8,7,22,10);

/*Table structure for table `user_event_role` */

DROP TABLE IF EXISTS `user_event_role`;

CREATE TABLE `user_event_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `event_id` int(11) NOT NULL DEFAULT '0',
  `role_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_user_event_role_user` (`user_id`),
  KEY `FK_user_event_role_events` (`event_id`),
  KEY `FK_user_event_role_roles` (`role_id`),
  CONSTRAINT `FK_user_event_role_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_user_event_role_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_user_event_role_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

/*Data for the table `user_event_role` */

insert  into `user_event_role`(`id`,`user_id`,`event_id`,`role_id`) values 
(1,2,1,1),
(2,7,4,2),
(3,7,5,1),
(4,1,1,1),
(5,1,1,2),
(6,2,1,2),
(7,7,1,1),
(11,1,19,2),
(12,2,19,2),
(13,7,19,1),
(15,1,21,2),
(16,3,21,2),
(17,5,21,2),
(18,8,21,1),
(27,7,20,1),
(28,8,22,2),
(29,6,22,2),
(30,7,22,1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
