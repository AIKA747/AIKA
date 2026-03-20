


INSERT INTO t_author (id, avatar, nickname, username, userId, type)
VALUES
    (1, 'avatar1.png', 'Author1', 'author1', 1874022463235452931, 'USER'),
    (2, 'avatar2.png', 'Author2', 'author2', 1874022463235452932, 'USER'),
    (3, 'avatar3.png', 'Author3', 'author3', 1874022463235452933, 'BOT');

-- Insert test data into t_post
INSERT INTO t_post (id,title, cover, topicTags, createdAt, updatedAt, author, type, likes, reposts, visits, summary, keywords, recommendTags, thread)
VALUES
    (1, 'Post Title 1', 'cover1.png', '#tag1,#tag2', NOW() - INTERVAL 1 DAY, NOW(), 1874022463235452931, 'USER', 10, 5, 100, 'Summary 1', 'keyword1,keyword2', 'tag1,tag2', '[{"content": "Post content 1", "title": "title1", "images":["url1", "url2"]}]'),
    (2, 'Post Title 2', 'cover2.png', '#tag3,#tag4', NOW() - INTERVAL 2 DAY, NOW(), 1874022463235452932, 'USER', 20, 10, 200, 'Summary 2', 'keyword3,keyword4', 'tag3,tag4', '[{"content": "Post content 2", "title": "title2"}]'),
    (3, 'Post Title 3', 'cover3.png', '#tag5,#tag6', NOW() - INTERVAL 3 DAY, NOW(), 1874022463235452933, 'BOT', 30, 15, 300, 'Summary 3', 'keyword5,keyword6', 'tag5,tag6', '[{"content": "Post content 3", "title": "title3"}]'),
    (4, 'Post Title 4', 'cover4.png', '#tag7,#tag8', NOW() - INTERVAL 4 DAY, NOW(), 1874022463235452931, 'USER', 40, 20, 400, 'Summary 4', 'keyword7,keyword8', 'tag7,tag8', '[{"content": "Post content 4"}]'),
    (5, 'Post Title 5', 'cover5.png', '#tag9,#tag10', NOW() - INTERVAL 5 DAY, NOW(), 1874022463235452932, 'USER', 50, 25, 500, 'Summary 5', 'keyword9,keyword10', 'tag9,tag10', '[{"content": "Post content 5"}]'),
    (6, 'Post Title 6', 'cover6.png', '#tag10,#tag11', NOW() - INTERVAL 5 DAY, NOW(), 1874022463235452932, 'USER', 50, 25, 600, 'Summary 5', 'keyword9,keyword10', 'tag9,tag10', '[{"content": "Post content 5"}]');


INSERT INTO t_follow_relation (dataVersion, deleted, creator, followingId, type, agreed) VALUES (1, 0, 1874022463235452931, 1874022463235452933, 'BOT', 1);
INSERT INTO t_follow_relation (dataVersion, deleted, creator, followingId, type, agreed) VALUES (1, 0, 1874022463235452931, 1874022463235452932, 'USER', 1);


INSERT INTO t_post_index (postId, summary, keywords, threadIndex, createdAt, updatedAt, dataVersion, deleted)
VALUES
    (1, 'Summary 1', 'keyword1,keyword2', 0, NOW() - INTERVAL 1 DAY, NOW(), 1, 0),
    (2, 'Summary 2', 'keyword3,keyword4', 0, NOW() - INTERVAL 2 DAY, NOW(), 1, 0),
    (3, 'Summary 3', 'keyword5,keyword6', 0, NOW() - INTERVAL 3 DAY, NOW(), 1, 0),
    (4, 'Summary 4', 'keyword7,keyword8', 0, NOW() - INTERVAL 4 DAY, NOW(), 1, 0),
    (5, 'Summary 5', 'keyword9,keyword10', 0, NOW() - INTERVAL 5 DAY, NOW(), 1, 0),
    (6, 'Summary 5', 'keyword10,keyword11', 1, NOW() - INTERVAL 5 DAY, NOW(), 1, 0);




SELECT
    p.id postId,
    p.author,
    a.nickname,
    a.username,
    a.avatar,
    pi.threadIndex,
    pi.createdAt,
    JSON_UNQUOTE(JSON_EXTRACT(p.thread, CONCAT('$[', pi.threadIndex, '].title')) )AS title,
    JSON_EXTRACT(p.thread, CONCAT('$[', pi.threadIndex, '].images')) AS images,
    JSON_UNQUOTE(JSON_EXTRACT(p.thread, CONCAT('$[', pi.threadIndex, '].content'))) AS content,
    JSON_UNQUOTE(JSON_EXTRACT(p.thread, CONCAT('$[', pi.threadIndex, ']'))) AS threadNode
FROM
    t_post_index pi
    left JOIN t_post p ON p.id = pi.postId
    left join t_author a on p.author = a.userId and p.type = a.type

WHERE
    pi.threadIndex >= 0;

