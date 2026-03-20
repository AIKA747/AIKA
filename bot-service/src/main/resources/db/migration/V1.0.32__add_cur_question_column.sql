ALTER TABLE game_thread ADD COLUMN curQuestion INT NULL COMMENT '当前问题索引，从0开始，null表示未开始';
ALTER table game change `knowledge` `knowledge` JSON DEFAULT NULL COMMENT '知识点';
ALTER table game change `questions` `questions` JSON DEFAULT NULL COMMENT '问题（JSON格式数组）';
ALTER table  game_thread change `result` `result` BIGINT DEFAULT NULL COMMENT '游戏结果ID';
ALTER table  game_thread change `dataVersion` `dataVersion` int DEFAULT NULL COMMENT '数据版本，每更新一次+1';
