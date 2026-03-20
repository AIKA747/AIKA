
INSERT INTO t_author (id, avatar, nickname, username, userId, type, pop,popUpdatedAt)
VALUES
    (1, 'avatar1.png', 'Author1', 'author1', 1, 'USER', 100, NOW()),
    (2, 'avatar2.png', 'keywordAuthor2', 'author2', 2, 'USER', 50,now()),
    (3, 'avatar3.png', 'Author3keyword', 'author3', 3, 'USER', 25,now()),
    (4, 'avatar3.png', 'authorkeyword4', 'author4', 4, 'USER', 25,now()),
    (5, 'avatar4.png', 'old man', 'author4', 44, 'USER', 150,NOW() - INTERVAL 40 DAY);

INSERT INTO t_follow_relation (id,dataVersion, deleted, creator, followingId, type, agreed) VALUES (1,1, 0, 1, 3, 'BOT', 1);
INSERT INTO t_follow_relation (id,dataVersion, deleted, creator, followingId, type, agreed) VALUES (2,1, 0, 1, 2, 'USER', 0);
INSERT INTO t_follow_relation (id,dataVersion, deleted, creator, followingId, type, agreed) VALUES (3, 1, 0, 4, 2, 'USER', 0);
INSERT INTO t_follow_relation (id,dataVersion, deleted, creator, followingId, type, agreed) VALUES (4,1, 0, 3, 44, 'USER', 1);
