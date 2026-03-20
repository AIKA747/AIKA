replace INTO `user` (`id`, `username`, `avatar`, `phone`, `email`, `password`, `status`, `gender`, `bio`, `tags`, `country`, `countryCode`, `birthday`, `botTotal`, `subBotTotal`, `storyTotal`, `followerTotal`, `notifyFlag`, `lastLoginAt`, `lastShareStoryAt`, `lastReleaseBotAt`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (100001, 'ces01', NULL, NULL, '123451@qq.com', '123456', 'unverified', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL, NULL, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
    (100002, 'ces02', NULL, NULL, '123452@qq.com', '123456', 'unverified', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL, NULL, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
    (100003, 'ces03', NULL, NULL, '123453@qq.com', '123456', 'enabled', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL, NULL, '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0);

replace INTO `follower` (`id`, `userId`, `followingId`,uf, fu, `lastReadTime`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (100001, 100001, 100002,1, 0, '2023-12-25 14:59:54', '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
    (100003, 100003, 100001,1, 0, '2023-12-25 14:59:54', '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0),
    (100004, 100003, 100002,1, 1, '2023-12-25 14:59:54', '2023-12-25 14:59:54', NULL, '2023-12-25 14:59:52', NULL, 1, 0);


