ALTER TABLE `bot`
    CHANGE `botIntroduce` `botIntroduce` TEXT CHARSET utf8mb4 NOT NULL COMMENT '机器人介绍',
    CHANGE `botCharacter` `botCharacter` TEXT CHARSET utf8mb4 NOT NULL COMMENT '机器人扮演的角色';

ALTER TABLE `bot_temp`
    CHANGE `botIntroduce` `botIntroduce` TEXT CHARSET utf8mb4 NOT NULL COMMENT '机器人介绍',
    CHANGE `botCharacter` `botCharacter` TEXT CHARSET utf8mb4 NOT NULL COMMENT '机器人扮演的角色';