INSERT INTO `bot` (`id`, `botSource`, `botName`, `botIntroduce`, `avatar`, `gender`, `age`, `categoryId`, `categoryName`, `profession`, `personality`, `botCharacter`, `personalStrength`, `conversationStyle`, `rules`, `prompts`, `knowledgeEnable`, `knowledges`, `supportedModels`, `album`, `botStatus`, `visibled`, `rating`, `chatTotal`, `subscriberTotal`, `dialogues`, `recommend`, `sortNo`, `recommendImage`, `recommendWords`, `recommendTime`, `greetWords`, `salutationPrompts`, `salutationFrequency`, `createdAt`, `creator`, `creatorName`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (1000000, 'builtIn', 'eee', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '["asd"]', 'online', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', 100000, 'aaa', '2024-01-02 16:53:38', 1, 1, 0),
    (1000001, 'builtIn', 'ces', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '["asd"]', 'offline', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', '1', 'aaa', '2024-01-02 16:53:38', 1, 2, 0),
    (1000003, 'builtIn', 'ces', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '["asd"]', 'online', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', '1', 'aaa', '2024-01-02 16:53:38', 1, 2, 0),
    (1000002, 'builtIn', 'ces', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '["asd"]', 'online', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', '1', 'aaa', '2024-01-02 16:53:38', 1, 2, 0);


INSERT INTO `bot_subscription` (`id`, `userId`, `botId`, `lastReadAt`, `subscriptionAt`)
VALUES
    (1000000, 100000, 1000000, '2024-01-02 17:09:28', '2024-01-02 17:09:31');


INSERT INTO `bot_temp` (`id`, `botId`, `publishTime`, `botSource`, `botName`, `botIntroduce`, `avatar`, `gender`, `age`, `categoryId`, `categoryName`, `profession`, `personality`, `botCharacter`, `personalStrength`, `conversationStyle`, `rules`, `prompts`, `knowledgeEnable`, `knowledges`, `supportedModels`, `album`, `botStatus`, `visibled`, `rating`, `chatTotal`, `subscriberTotal`, `dialogues`, `recommend`, `sortNo`, `recommendImage`, `recommendWords`, `recommendTime`, `greetWords`, `salutationPrompts`, `salutationFrequency`, `createdAt`, `creator`, `creatorName`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (1000000, 1000000, null, 'builtIn', 'eee32', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '[]', 'online', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', 100000, 'aaa', '2024-01-02 16:53:38', 1, 1, 0),
    (1000001, 1000000, '2024-01-03 09:22:22', 'builtIn', 'ces', 'asfd', 'http://l', 'HIDE', 12, 1, 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', '[]', 'sf', 0, '[]', '[]', '[]', 'offline', 0, 21, 1, 12, 0, 0, 1, 'asdf', 'adsf', '2024-01-02 16:56:02', 'afd', 'asdf', 1, '2024-01-02 16:53:31', 100000, 'aaa', '2024-01-02 16:53:38', 1, 2, 0);
