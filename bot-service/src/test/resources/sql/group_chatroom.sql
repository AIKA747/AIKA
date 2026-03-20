INSERT INTO `t_chatroom` (`id`, `roomName`, `roomType`, `groupType`, `roomAvatar`, `description`, `roomCode`,`historyMsgVisibility`, `permissions`, `creator`, `updater`, `dataVersion`)
    VALUES ('1', 'TEST1', 'GROUP_CHAT', 'PUBLIC', 'http://www.baidu.com/1.jpg', 'test', '123456789', 0,'[]', '1', '1', '0');
INSERT INTO `t_chatroom` (`id`, `roomName`, `roomType`, `groupType`, `roomAvatar`, `description`, `roomCode`,`historyMsgVisibility`, `permissions`, `creator`, `updater`, `dataVersion`)
    VALUES ('2', 'TEST2', 'GROUP_CHAT', 'PRIVATE', 'http://www.baidu.com/1.jpg', 'test', '123456784',1, '[]', '1', '1', '0');
INSERT INTO `t_chatroom_member` (`id`, `roomId`, `memberType`, `memberId`, `avatar`, `nickname`, `username`,`memberRole`, `status`, `creator`, `updater`)
    VALUES (1, '1', 'USER', '1', '1.JPG', 'test1', 'test1', 'OWNER', 'APPROVE', '1', '1');
INSERT INTO `t_chatroom_member` (`id`, `roomId`, `memberType`, `memberId`, `avatar`, `nickname`, `username`,`memberRole`, `status`, `creator`, `updater`)
    VALUES (2, '1', 'USER', '2', '1.JPG', 'test1', 'test1', 'MEMBER', 'APPROVE', '1', '1');
INSERT INTO `t_chatroom_member` (`id`, `roomId`, `memberType`, `memberId`, `avatar`, `nickname`, `username`,`memberRole`, `notifyTurnOffTime`, `status`, `theme`, `lastReadTime`, `createdAt`,`creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
    VALUES (3, '1', 'USER', '3', '3.JPG', 'test3', 'test3', 'MEMBER', NULL, 'APPROVE', NULL, '2025-03-04 16:43:48', '2025-03-04 16:43:48','1', '2025-03-04 16:43:48', '1', '0', '0');
INSERT INTO `t_chatroom_member` (`id`, `roomId`, `memberType`, `memberId`, `avatar`, `nickname`, `username`,`memberRole`, `status`, `creator`, `updater`)
VALUES (4, '2', 'USER', '1', '1.JPG', 'test1', 'test1', 'OWNER', 'APPROVE', '1', '1');
INSERT INTO `t_chatroom_member` (`id`, `roomId`, `memberType`, `memberId`, `avatar`, `nickname`, `username`,`memberRole`, `notifyTurnOffTime`, `status`, `theme`, `lastReadTime`, `createdAt`,`creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES (5, '2', 'USER', '2', '2.JPG', 'test2', 'test2', 'MEMBER', NULL, 'APPROVE', NULL, NULL, '2025-03-04 16:43:48','1', '2025-03-04 16:43:48', '1', '0', '0');
INSERT INTO `t_chatroom_member` (`id`, `roomId`, `memberType`, `memberId`, `avatar`, `nickname`, `username`,`memberRole`, `notifyTurnOffTime`, `status`, `theme`, `lastReadTime`, `createdAt`,`creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES (6, '2', 'USER', '3', '3.JPG', 'test3', 'test3', 'MEMBER', NULL, 'FRIEND_INVITE', NULL, NULL, '2025-03-04 16:43:48','1', '2025-03-04 16:43:48', '1', '0', '0');
