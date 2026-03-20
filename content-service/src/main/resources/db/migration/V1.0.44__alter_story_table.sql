ALTER TABLE `t_story`
    CHANGE `cover` `cover` VARCHAR (500) CHARSET utf8mb4 NULL,
    CHANGE `listCover` `listCover` VARCHAR (1000) CHARSET utf8mb4 NULL COMMENT '列表所用的封面图片';
