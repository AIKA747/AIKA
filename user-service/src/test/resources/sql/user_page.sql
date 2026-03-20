INSERT INTO `user` (`id`, `username`, `avatar`, `phone`, `email`, `password`, `status`, `gender`, `bio`, `tags`, `country`, `countryCode`, `birthday`, `botTotal`, `subBotTotal`, `storyTotal`, `followerTotal`, `notifyFlag`, `lastLoginAt`, `lastShareStoryAt`, `lastReleaseBotAt`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
       (1000001, 'ces01', "http://www.avatar.com", '18375729810', '123451@qq.com', '123456', 'enabled','MALE', 'my bio', '[ "唱", "跳", "rap" ]', "china", NULL, NULL, 11, 11, 11, 11, 0, NULL, NULL, NULL, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
       (1000002, 'ces02', NULL, NULL, '123452@qq.com', '123456', 'enabled', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL, NULL, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
       (1000003, 'ces03', NULL, NULL, '123453@qq.com', '123456', 'enabled', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL, NULL, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0);

INSERT INTO `user_group_rel` (`groupId`, `userId`)
VALUES
    (100001, 1000001),
    (100001, 1000002),
    (100002, 1000001);

INSERT INTO `group` (`id`, `groupName`, `userCount`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (100001, 'ces', 11, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
    (100002, 'ces2', 0, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
    (100003, 'ces3', 0, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0);

INSERT INTO `firebase_user_token` (`token`, `userId`, `createdAt`, `updatedAt`, `deleted`)
VALUES
    ("100001", 1000001, "2023-12-25 14:59:54", "2023-12-25 14:59:54", 0),
    ("100001", 1000002, "2023-12-25 14:59:54", "2023-12-25 14:59:54", 0),
    ("100003", 1000003, "2023-12-25 14:59:54", "2023-12-25 14:59:54", 0);
