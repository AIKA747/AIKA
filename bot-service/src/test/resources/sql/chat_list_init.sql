INSERT INTO `bot` (`id`, `botSource`, `botName`, `botIntroduce`, `avatar`, `gender`, `age`, `categoryId`, `categoryName`, `profession`, `personality`, `botCharacter`, `personalStrength`, `conversationStyle`, `rules`, `prompts`, `knowledgeEnable`, `knowledges`, `supportedModels`, `album`, `botStatus`, `visibled`, `rating`, `chatTotal`, `subscriberTotal`, `dialogues`, `recommend`, `sortNo`, `recommendImage`, `recommendWords`, `recommendTime`, `greetWords`, `salutationPrompts`, `salutationFrequency`, `createdAt`, `creator`, `creatorName`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (1000000, 'builtIn', '测试用例机器人1', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '[]', 'online', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', '1', 'aaa', '2024-01-02 16:53:38', NULL, 1, 0),
    (1000001, 'builtIn', '测试用例机器人2', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '[]', 'offline', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', '1', 'aaa', '2024-01-02 16:53:38', NULL, 2, 0),
    (1000002, 'builtIn', '测试用例机器人3', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '[]', 'online', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', '1', 'aaa', '2024-01-02 16:53:38', NULL, 2, 0);


INSERT INTO `bot_subscription` (`id`, `userId`, `botId`, `lastReadAt`, `subscriptionAt`)
VALUES
    (1000000, 100000, 1000000, '2024-01-02 17:09:28', '2024-01-02 17:09:31'),
    (1000001, 100001, 1000001, '2024-01-02 17:09:28', '2024-01-02 17:09:31'),
    (1000002, 100000, 1000001, '2024-01-02 17:09:28', '2024-01-02 17:09:31');


INSERT INTO `message_record` (`id`, `botId`, `userId`, `contentType`, `textContent`, `media`, `fileProperty`, `sourceType`, `msgStatus`, `readFlag`, `readTime`, `replyMessageId`, `createdAt`, `creator`, `creatorName`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
       (100001, 1000000, 100000, 'TEXT', 'asd', 'sdf', '{}', 'user', 'success', 0, '2024-01-04 10:18:56', 1, '2024-01-04 10:19:01', 'app用户1', 'asdf', '2024-01-04 10:19:07', NULL, 1, 0),
       (100002, 1000000, 100000, 'TEXT', 'ddd', 'sddf', '{}', 'user', 'success', 0, '2024-01-04 11:18:56', 1, '2024-01-04 11:19:01', 'app用户1', 'asdf', '2024-01-04 11:19:07', NULL, 1, 0),
       (100003, 1000001, 100001, 'TEXT', 'asssd', 'sdddf', '{}', 'user', 'success', 0, '2024-01-04 10:18:56', 1, '2024-01-04 10:19:01', 'app用户2', 'asdf', '2024-01-04 10:19:07', NULL, 1, 0),
       (100004, 1000001, 100001, 'TEXT', 'ddssd', 'sdddf', '{}', 'user', 'success', 0, '2024-01-04 11:18:56', 1, '2024-01-04 11:19:01', 'app用户2', 'asdf', '2024-01-04 11:19:07', NULL, 1, 0);
