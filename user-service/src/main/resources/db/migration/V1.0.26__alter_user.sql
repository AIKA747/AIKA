alter table user drop column habit;
alter table user drop column personality;
alter table user drop column competitive;
alter table user drop column skillBased;
alter table user drop column intelligence  ;

ALTER TABLE `user`
    add column sport json null comment 'sport 向量' after facebookPayload,
    add column entertainment json null comment 'entertainment 向量' after sport,
    add column news json null comment 'news 向量' after entertainment,
    add column gaming json null comment 'gaming 向量' after news,
    add column technology json null comment 'technology 向量' after lifestyle,
    add column social  json null comment 'social 向量' after technology;


