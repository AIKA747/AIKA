INSERT INTO game (
    id, gameName, introduce, description, cover, listCover, avatar, listDesc, enable, orderNum, 
    createdAt, updatedAt, creator, updater, instructions, assistantName, questions, knowledge ,free,listCoverDark,coverDark
)
VALUES 
(1, 'Test Game 1', 'Test Intro 1', 'Test Desc 1', 'cover1.jpg', 'list1.jpg', 'avatar1.jpg', 'list desc 1', true, 2,
    NOW(), NOW(), 1, 1, 'Test Instructions 1', 'Test Assistant 1', '["question1", "question2"]', '["knowledge1"]',0,'lcd','coverDark'),
(2, 'Test Game 2', 'Test Intro 2', 'Test Desc 2', 'cover2.jpg', 'list2.jpg', 'avatar2.jpg', 'list desc 2', true, 1,
    NOW(), NOW(), 1, 1, 'Test Instructions 2', 'Test Assistant 2', '["question1", "question2"]', '["knowledge1"]',1,'lcd','coverDark'),
(3, 'Test Game 3', 'Test Intro 2', 'Test Desc 2', 'cover2.jpg', 'list2.jpg', 'avatar2.jpg', 'list desc 2', false, 1,
 NOW(), NOW(), 1, 1, 'Test Instructions 3', 'Test Assistant 2', '["question1", "question2"]', '["knowledge1"]',0,'lcd','coverDark');

INSERT INTO game_result (id, gameId, summary, description, cover, createdAt, updatedAt, creator, updater, dataVersion)
VALUES
(1, 1, 'Test Summary 1', 'Test Description 1', 'result1.jpg', NOW(), NOW(), 1, 1, 1),
(2, 2, 'Test Summary 2', 'Test Description 2', 'result2.jpg', NOW(), NOW(), 1, 1, 1);

INSERT INTO game_thread (id, gameId, status, result, threadId, createdAt, updatedAt, creator, updater, dataVersion)
VALUES
(1, 1, 'UNCOMPLETED', 1, null, NOW(), NOW(), 1, 1, 1),
(2, 2, 'COMPLETE', 2, 'thread1', NOW(), NOW(), 1, 1, 1);
