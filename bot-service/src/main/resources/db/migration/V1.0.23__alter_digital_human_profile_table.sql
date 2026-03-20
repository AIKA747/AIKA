ALTER TABLE `digital_human_profile`
    ADD COLUMN `voiceName` VARCHAR(20) NULL COMMENT '生成视频的音色名称' AFTER `greetVideoId`;