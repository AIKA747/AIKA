ALTER TABLE `digital_human_video_record`
    CHANGE `id` `id` VARCHAR(64) NOT NULL COMMENT '主键id';
ALTER TABLE `digital_human_profile`
    CHANGE `idleVideoId` `idleVideoId` VARCHAR(64) NULL COMMENT '空闲视频id',
    CHANGE `greetVideoId` `greetVideoId` VARCHAR(64) NULL COMMENT '欢迎视频id';
