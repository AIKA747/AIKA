CREATE TABLE IF NOT EXISTS `tts_openai_voice` (
    `voiceName` varchar(20) NOT NULL COMMENT '音色名称',
    `gender` varchar(20) NOT NULL COMMENT '性别：MALE, FEMALE',
    `sortNo` int NOT NULL DEFAULT '0' COMMENT '排序',
    PRIMARY KEY (`voiceName`)
) ENGINE=InnoDB;