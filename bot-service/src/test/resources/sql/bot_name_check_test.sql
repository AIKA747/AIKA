-- Insert test data for bot name check endpoint
INSERT INTO bot (
    id, botSource, botName, botIntroduce, avatar, gender, age,
    categoryId, categoryName, profession, botCharacter, personalStrength,
    conversationStyle, botStatus, rating, chatTotal, subscriberTotal,
    dialogues, recommend, createdAt, updatedAt, deleted
) VALUES
      (1, 'userCreated', 'existingBot', 'Test bot', 'avatar.jpg', 'MALE', 25,
       1, 'Test Category', 'Developer', 'Assistant', 'Coding',
       'Friendly', 'online', 0.0, 0, 0, 0, 0, NOW(), NOW(), 0),
      (2, 'userCreated', 'anotherBot', 'Test bot 2', 'avatar2.jpg', 'FEMALE', 30,
       1, 'Test Category', 'Designer', 'Helper', 'UI Design',
       'Professional', 'online', 0.0, 0, 0, 0, 0, NOW(), NOW(), 0);
