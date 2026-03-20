INSERT INTO game (id, questions,instructions,gameName,assistantName,introduce,description,cover,listCover,avatar,listDesc) VALUES
                                                                                                                               (1, '["Q1", "Q2", "Q3"]','ii1111','g1','a1','introduce1','d1','c1','l1','a1','ld1'),
                                                                                                                               (2, '["Q1", "Q2", "Q3112"]','ii1111222','g2','a2','introduce2','d2','c2','l2','a2','ld2'),
                                                                                                                               (3, '["Q1", "Q2", "Q3"]','ii1111333','g3','a3','introduce3','d3','c3','l3','a3','ld3'),
                                                                                                                               (4, null,'ii1113331333','g3','a3','introduce3','d3','c3','l3','a3','ld3');

-- 初始化游戏线程数据
INSERT INTO game_thread (id, gameId, curQuestion,status,deleted) VALUES
                                                        (1, 1, null,'UNCOMPLETED',0),  -- 游戏未开始
                                                        (2, 2, 1,'UNCOMPLETED',0),     -- 游戏进行中
                                                        (3, 3, 2,'COMPLETE',0),    -- 游戏结束
                                                        (4, 30, 2,'COMPLETE',0),    -- 游戏结束
                                                        (5, 4, null,'UNCOMPLETED',0);    -- 游戏结束
