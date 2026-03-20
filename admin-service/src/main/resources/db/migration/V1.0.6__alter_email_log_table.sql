ALTER TABLE `email_log`
    CHANGE `status` `status` ENUM('success','fail') CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '状态：success,fail', AUTO_INCREMENT=17642236555589;
