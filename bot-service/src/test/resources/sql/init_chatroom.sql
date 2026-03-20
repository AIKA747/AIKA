INSERT INTO `t_chatroom` (`id`, `roomName`, `roomType`, `groupType`, `roomAvatar`, `memberLimit`, `description`, `roomCode`, `historyMsgVisibility`, `permissions`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `joinDirectly`)
VALUES
    ('1', 'test', 'GROUP_CHAT', 'PUBLIC', 'test', '5', 'test', '213213123', '0', '[{\"memberRole\": \"MODERATOR\", \"addOtherMembers\": false, \"linkChatToPosts\": true, \"approveNewMembers\": true, \"changeGroupSettings\": true}, {\"memberRole\": \"MEMBER\", \"addOtherMembers\": true, \"linkChatToPosts\": false, \"changeGroupSettings\": false}]', '2025-03-04 03:54:07', '1', '2025-03-04 03:54:07', '1', '1', '0', '0');


INSERT INTO `t_chatroom_member` (`id`, `roomId`, `memberType`, `memberId`, `avatar`, `nickname`, `username`, `memberRole`, `notifyTurnOffTime`, `status`, `theme`, `lastReadTime`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (1, 1, 'USER', 2, 'www', 'ttt', 'www', 'MEMBER', NULL, 'APPROVE', NULL, NULL, '2025-03-04 04:01:21', '1', '2025-03-04 04:01:21', '1', '1', '0'),
    (2, 1, 'USER', 3, 'www', 'ffff', 'sdfsdf', 'MODERATOR', NULL, 'APPROVE', NULL, NULL, '2025-03-04 04:02:53', '1', '2025-03-04 04:02:53', '1', '1', '0'),
    (3, 1, 'USER', 4, 'sdf', 'dsfsdf', 'ddd', 'OWNER', NULL, 'APPROVE', NULL, NULL, '2025-03-04 04:03:42', '1', '2025-03-04 04:03:42', '1', '1', '0'),
    (4, 1, 'USER', 5, 'sdf', 'sdf', 'sdf', 'MEMBER', NULL, 'USER_JOIN_REQUEST', NULL, NULL, '2025-03-04 04:04:17', '1', '2025-03-04 04:04:17', '1', '1', '0');

