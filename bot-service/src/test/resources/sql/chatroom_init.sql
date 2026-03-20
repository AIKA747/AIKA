
INSERT INTO t_chatroom(id,roomType,grouptype,roomAvatar,description, roomCode, roomName, updater, permissions,dataVersion,  creator) VALUES
(1001,'GROUP_CHAT', 'PUBLIC', 'http://xx.aa.jpg','', 'random_uuid', 'test room',1, '[{"memberRole":"MODERATOR","changeGroupSettings":true}]', 1, 1);


INSERT INTO t_chatroom_member(roomId,memberType, avatar,nickname,username, notifyTurnOffTime, theme,creator,updater, memberId, memberRole, status, dataVersion) VALUES
(1001,'USER','','nickname1','username1',current_timestamp,'{}',1,1, 1, 'OWNER', 'APPROVE',1),
(1001,'USER','','nickname2','username2',current_timestamp,'{}',1,1, 2, 'MODERATOR', 'APPROVE',1),
(1001,'USER','','nickname3','username3',current_timestamp,'{}',1,1, 3, 'MEMBER', 'APPROVE',1);



