INSERT INTO bot_collection (id,dataVersion, type, avatar, collectionName, category, creator, updater)
VALUES (1,1, 'TALES', 'https://example.com/avatar1.png', 'Fairy Tales', 1, 101, 101),
       (2,1, 'EXPERT', 'https://example.com/avatar2.png', 'Expert Advisors', 2, 102, 102),
       (3,1, 'GAME', 'https://example.com/avatar3.png', 'Adventure Games', 3, 103, 103),
       (4,1, 'TALES', 'https://example.com/avatar4.png', 'Mythical Stories', NULL, 104, 104),
       (5,1, 'EXPERT', 'https://example.com/avatar5.png', 'Tech Gurus', 4, 105, 105);

INSERT INTO bot_collection_item (botId,dataVersion, type, collectionId, avatar, name, description, listCover, creator, updater, listCoverDark)
VALUES (1,1, 'TALES', 1, 'https://example.com/bot1.png', 'Cinderella', 'A classic fairy tale character.',
        'https://example.com/cover1.png', 201, 201,'l1'),
       (2,1, 'EXPERT', 2, 'https://example.com/bot2.png', 'Financial Advisor', 'Expert in financial planning.',
        'https://example.com/cover2.png', 202, 202,'l2'),
       (3,1, 'GAME', 3, 'https://example.com/bot3.png', 'Dungeon Explorer', 'A brave adventurer for RPG games.',
        'https://example.com/cover3.png', 203, 203,'l3'),
       (4,1, 'TALES', 1, 'https://example.com/bot4.png', 'Snow White', 'Famous character from tales.',
        'https://example.com/cover4.png', 201, 201,'l4'),
       (5,1, 'EXPERT', 2, 'https://example.com/bot5.png', 'AI Specialist', 'Expert in artificial intelligence.',
        'https://example.com/cover5.png', 202, 202,'l5'),
       (6,1, 'GAME', 3, 'https://example.com/bot6.png', 'Space Commander', 'Leader of interstellar missions.',
        'https://example.com/cover6.png', 203, 203,'l6');
