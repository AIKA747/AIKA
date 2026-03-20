package com.parsec.aika.common.hander

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler
import org.apache.ibatis.reflection.MetaObject
import java.time.LocalDateTime

/**
 * MyBatis Plus 自动填充
 *
 * @author Zijian Liao
 * @since v1.0.0
 */
class MyMetaObjectHandler : MetaObjectHandler {
    override fun insertFill(metaObject: MetaObject) {
        // 有字段则自动填充
        if (metaObject.hasSetter(CREATE_TIME)) {
            strictInsertFill<LocalDateTime?, LocalDateTime?>(
                metaObject,
                CREATE_TIME,
                LocalDateTime::class.java,
                LocalDateTime.now()
            )
        }
        if (metaObject.hasSetter(UPDATE_TIME)) {
            strictInsertFill<LocalDateTime?, LocalDateTime?>(
                metaObject,
                UPDATE_TIME,
                LocalDateTime::class.java,
                LocalDateTime.now()
            )
        }
        if (metaObject.hasSetter(DATA_VERSION)) {
            strictInsertFill<Int?, Int?>(metaObject, DATA_VERSION, Int::class.java, 0)
        }
        if (metaObject.hasSetter(DELETED)) {
            strictInsertFill<Int?, Int?>(metaObject, DELETED, Int::class.java, 0)
        }
    }

    override fun updateFill(metaObject: MetaObject?) {
        val `val` = getFieldValByName(UPDATE_TIME, metaObject)
        // 没有自定义值时才更新字段
        if (`val` == null) {
            strictUpdateFill<LocalDateTime?, LocalDateTime?>(
                metaObject,
                UPDATE_TIME,
                LocalDateTime::class.java,
                LocalDateTime.now()
            )
        }
    }

    companion object {
        /**
         * 通用字段：创建时间
         */
        private const val CREATE_TIME = "createdAt"

        /**
         * 通用字段：更新时间
         */
        private const val UPDATE_TIME = "updatedAt"

        /**
         * 通用字段：数据版本
         */
        private const val DATA_VERSION = "dataVersion"

        /**
         * 通用字段：已删除
         */
        private const val DELETED = "deleted"
    }
}
