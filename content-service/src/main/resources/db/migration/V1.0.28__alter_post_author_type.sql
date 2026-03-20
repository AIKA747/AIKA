ALTER TABLE t_post 
    CHANGE `author` `author` BIGINT NOT NULL DEFAULT 0;

ALTER TABLE t_thumb
    CHANGE `creator` `creator` BIGINT NOT NULL;