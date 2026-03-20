ALTER TABLE `assistant`
    CHANGE `botCharacter` `botCharacter` VARCHAR(1000) CHARSET utf8mb4 NOT NULL COMMENT '机器人扮演的角色',
    CHANGE `personalStrength` `personalStrength` VARCHAR(1000) CHARSET utf8mb4 NOT NULL COMMENT '擅长领域',
    CHANGE `salutationPrompts` `salutationPrompts` TEXT CHARSET utf8mb4 COMMENT '预留字段（许久没有聊天，机器人主动打招呼prompt）',
    CHANGE `prompts` `prompts` TEXT CHARSET utf8mb4 NULL;
