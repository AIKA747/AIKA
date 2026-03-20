ALTER TABLE `t_story`
    CHANGE `introduction` `introduction` TEXT CHARSET utf8mb4 NOT NULL,
    CHANGE `failureCopywriting` `failureCopywriting` TEXT CHARSET utf8mb4 NOT NULL,
    CHANGE `listCover` `listCover` VARCHAR (1000) CHARSET utf8mb4 NOT NULL COMMENT '列表所用的封面图片';

ALTER TABLE `t_story_chapter`
    CHANGE `cover` `cover` VARCHAR (500) CHARSET utf8mb4 NULL,
    CHANGE `image` `image` VARCHAR (500) CHARSET utf8mb4 NOT NULL,
    CHANGE `personality` `personality` TEXT CHARSET utf8mb4 NOT NULL,
    CHANGE `introduction` `introduction` TEXT CHARSET utf8mb4 NULL,
    CHANGE `passedCopywriting` `passedCopywriting` TEXT CHARSET utf8mb4 NULL,
    CHANGE `passedPicture` `passedPicture` VARCHAR (500) CHARSET utf8mb4 NULL,
    CHANGE `backgroundPrompt` `backgroundPrompt` TEXT CHARSET utf8mb4 NOT NULL,
    CHANGE `tonePrompt` `tonePrompt` TEXT CHARSET utf8mb4 NULL,
    CHANGE `wordNumberPrompt` `wordNumberPrompt` VARCHAR (1000) CHARSET utf8mb4 NULL,
    CHANGE `listCover` `listCover` VARCHAR (1000) CHARSET utf8mb4 NOT NULL COMMENT '列表所用的封面图片';