ALTER TABLE `bot`
    CHANGE `personalStrength` `personalStrength` TEXT CHARSET utf8mb4 NOT NULL COMMENT '擅长领域',
    CHANGE `prompts` `prompts` TEXT CHARSET utf8mb4 NULL,
    CHANGE `album` `album` JSON NULL COMMENT '相册',
    CHANGE `greetWords` `greetWords` VARCHAR(1000) CHARSET utf8mb4 NULL COMMENT '欢迎语';

ALTER TABLE `bot_temp`
    CHANGE `personalStrength` `personalStrength` TEXT CHARSET utf8mb4 NOT NULL COMMENT '擅长领域',
    CHANGE `prompts` `prompts` TEXT CHARSET utf8mb4 NULL,
    CHANGE `album` `album` JSON NULL COMMENT '相册',
    CHANGE `greetWords` `greetWords` VARCHAR(1000) CHARSET utf8mb4 NULL COMMENT '欢迎语';