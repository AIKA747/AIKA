package com.parsec.aika.user.mapper.provider

class NotificationSqlProvider {

    fun readAllNotification(params: Map<String, Any>): String {
        return "update notification set readUserIds = JSON_ARRAY_APPEND(IFNULL(readUserIds,'[]'), '\$',JSON_OBJECT('userId', \${userId}, 'readAt',now())) WHERE JSON_CONTAINS(IFNULL(userIds,'[]'), '\${userId}') AND ifnull(JSON_CONTAINS(JSON_EXTRACT(readUserIds, '\$[*].userId'),'\${userId}'),0)=0"
    }
}