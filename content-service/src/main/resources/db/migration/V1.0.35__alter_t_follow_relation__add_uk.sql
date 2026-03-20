alter table t_follow_relation
    add constraint uk_creator_followingId
        unique ( creator, followingId);

