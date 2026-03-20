package com.parsec.aika.common.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;

import java.time.LocalDateTime;

/**
 * MyBatis Plus 自动填充
 *
 * @author Zijian Liao
 * @since v1.0.0
 */
public class MyMetaObjectHandler implements MetaObjectHandler {

    /**
     * 通用字段：创建时间
     */
    private static final String CREATE_TIME = "createdAt";

    /**
     * 通用字段：更新时间
     */
    private static final String UPDATE_TIME = "updatedAt";
    /**
     * 通用字段：数据版本
     */
    private static final String DATA_VERSION = "dataVersion";

    /**
     * 通用字段：已删除
     */
    private static final String DELETED = "deleted";

    @Override
    public void insertFill(MetaObject metaObject) {
        // 有字段则自动填充
        if (metaObject.hasSetter(CREATE_TIME)) {
            strictInsertFill(metaObject, CREATE_TIME, LocalDateTime.class, LocalDateTime.now());
        }
        if (metaObject.hasSetter(UPDATE_TIME)) {
            strictInsertFill(metaObject, UPDATE_TIME, LocalDateTime.class, LocalDateTime.now());
        }
        if (metaObject.hasSetter(DATA_VERSION)) {
            strictInsertFill(metaObject, DATA_VERSION, Integer.class, 0);
        }
        if (metaObject.hasSetter(DELETED)) {
            strictInsertFill(metaObject, DELETED, Integer.class, 0);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        Object val = getFieldValByName(UPDATE_TIME, metaObject);
        // 没有自定义值时才更新字段
        if (val == null) {
            strictUpdateFill(metaObject, UPDATE_TIME, LocalDateTime.class, LocalDateTime.now());
        }
    }

}
