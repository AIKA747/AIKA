package com.parsec.aika.bot.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.util.IdUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.ChatroomMsgLastTimeReq
import com.parsec.aika.bot.model.vo.req.LastTimeType
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.bot.service.ChatroomService
import com.parsec.aika.bot.service.GroupChatRecordsService
import com.parsec.aika.common.mapper.GroupChatRecordsMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.const.RedisConst.CHATROOM_KEY_PREFIX
import com.parsec.aika.common.model.const.RedisConst.MESSAGE_KEY
import com.parsec.aika.common.model.const.RedisConst.RECALL_MESSAGE_FLAG
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.entity.GroupChatRecords
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit
import javax.annotation.Resource

/**
 * @author 77923
 * @description 针对表【t_group_chat_records】的数据库操作Service实现
 * @createDate 2025-02-24 11:54:11
 */
@Service
class GroupChatRecordsServiceImpl : ServiceImpl<GroupChatRecordsMapper?, GroupChatRecords?>(), GroupChatRecordsService {

    @Autowired
    private lateinit var chatroomMemberService: ChatroomMemberService

    @Autowired
    private lateinit var chatroomService: ChatroomService

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    private final val maxRecordNum = 500L

    override fun saveChatRecord(roid: Int, records: GroupChatRecords): Long {
        if (records.status == MsgStatus.recanlled) {
            return records.id!!
        }
        //图片、语音、视频，记录到数据库中
        if (records.ct != ContentType.TEXT) {
            //记录到数据库中的消息需要保存聊天室id
            records.roid = roid
            this.save(records)
        } else {
            records.id = IdUtil.getSnowflake().nextId()
        }
        //保存单条消息到redis，用于消息撤回时，查询对应的消息信息
        stringRedisTemplate.opsForValue()
            .set("$MESSAGE_KEY${records.id}", JSONUtil.toJsonStr(records), 5, TimeUnit.MINUTES)

        val opsForList = stringRedisTemplate.opsForList()
        // 将对象保存到 Redis 的 List 中
        opsForList.leftPush("$CHATROOM_KEY_PREFIX$roid", JSONUtil.toJsonStr(records))
        // 限制列表的最大长度为 100
        opsForList.trim("$CHATROOM_KEY_PREFIX$roid", 0, maxRecordNum - 1)
        //最长保存时间30天
        stringRedisTemplate.expire("$CHATROOM_KEY_PREFIX$roid", 30, TimeUnit.DAYS)
        return records.id!!
    }

    override fun queryChatRecords(
        pageNo: Long, pageSize: Long, roomId: Int, user: LoginUserInfo
    ): PageResult<ChatMessageBO> {
        //1.根据 roomId ,查询出 Chatroom 对象，并取属性  historyMsgVisibility 。
        val chatroom = chatroomService.getById(roomId) ?: throw BusinessException("room not exist")
        //2.根据 memberId={当前用户id} and roomId = {roomId} 获得ChatroomMember对象，并从中查询出lastReadTime
        val chatroomMember =
            chatroomMemberService.ktQuery().eq(ChatroomMember::roomId, roomId).eq(ChatroomMember::memberId, user.userId)
                .eq(ChatroomMember::status, GroupMemberStatus.APPROVE).orderByDesc(ChatroomMember::id).last("limit 1")
                .one() ?: throw BusinessException("You are no longer in this chat group.")
        //将清空时间置空
        if (null != chatroomMember.clearTime && null != chatroom.lastMessageTime && chatroomMember.clearTime!! > chatroom.lastMessageTime) {
            chatroomMemberService.ktUpdate().set(ChatroomMember::clearTime, chatroom.lastMessageTime)
                .eq(ChatroomMember::id, chatroomMember.id).update()
        }
        //3.如果lastReadTime为空，说明这个人是新进群的新人，此时如果 historyMsgVisibility 为 false，则不返回任何的信息。
        if (chatroom.historyMsgVisibility != true && null == chatroomMember.lastLoadTime && chatroomMember.memberRole != GroupMemberRole.OWNER) {
            return PageResult<ChatMessageBO>().apply {
                this.pageNum = pageNo
                this.pageSize = pageSize
                this.total = 0
                this.pages = 0
                this.list = emptyList<ChatMessageBO>()
            }
        }
        //4.如果 historyMsgVisibility 为 ture，从Redis中分页按时间先后顺序（发表时间升序），分页返回所有记录。
        val redisKey = "$CHATROOM_KEY_PREFIX$roomId"
        // 获取 Redis List 中的部分元素
        val opsForList = stringRedisTemplate.opsForList()
        if (chatroom.historyMsgVisibility == true || chatroomMember.memberRole == GroupMemberRole.OWNER) {
            val start = (pageNo - 1) * pageSize
            val end = start + pageSize - 1
            val total = opsForList.size(redisKey) ?: 0
            val records = opsForList.range(redisKey, start, end)
            return PageResult<ChatMessageBO>().apply {
                this.pageNum = pageNo
                this.pageSize = pageSize
                this.total = total
                this.pages = if (total % pageSize == 0L) total / pageSize else total / pageSize + 1
                if (CollUtil.isNotEmpty(records)) {
                    this.list = convertToChatMessage(records!!)
                }
            }
        }
        //5.则从Redis中分页返回时间大于lastLoadTime的聊天记录
        val records = opsForList.range(redisKey, 0, maxRecordNum - 1)
        if (CollUtil.isEmpty(records)) {
            return PageResult<ChatMessageBO>().apply {
                this.pageNum = pageNo
                this.pageSize = pageSize
                this.total = 0
                this.pages = 0
                this.list = emptyList<ChatMessageBO>()
            }
        }

        val list = this.convertToChatMessage(records!!).filter {
            it.createdAt!!.isAfter(chatroomMember.lastLoadTime)
        }.toList()
        val start = (pageNo - 1) * pageSize
        val end = start + pageSize - 1
        return PageResult<ChatMessageBO>().apply {
            this.pageNum = pageNo
            this.pageSize = pageSize
            this.total = list.size.toLong()
            this.pages = if (this.total % pageSize == 0L) this.total / pageSize else this.total / pageSize + 1
            this.list = CollUtil.sub(list, start.toInt(), end.toInt())
        }
    }

    override fun convertChatMessage(record: GroupChatRecords): ChatMessageBO {
        val messageBO = ChatMessageBO().apply {
            this.msgId = record.id.toString()
            this.objectId = record.roid.toString()
            this.userId = record.uid.toString()
            this.sourceType = record.st
            this.contentType = record.ct
            this.avatar = record.avatar
            this.nickname = record.nn
            this.textContent = record.txt
            this.media = record.med
            this.replyMessageId = record.rid
            this.replyMessage = record.rmessage
            if (null != record.fn || null != record.flength || null != record.fileProp) {
                if (StrUtil.isNotBlank(record.fileProp)) {
                    this.fileProperty = record.fileProp
                } else {
                    val jsonObj = JSONObject().apply {
                        this.set("length", record.flength)
                        this.set("fileName", record.fn)
                    }
                    this.fileProperty = JSONUtil.toJsonStr(jsonObj)
                }
            }
            this.createdAt = record.time
            this.json = record.json
            this.roomName = record.roomName
            this.roomAvatar = record.roomAvatar
            this.memberIds = record.memberIds
            this.forwardInfo = record.forwardInfo
            this.msgStatus = record.status
            this.gender = record.gender
        }
        if (messageBO.msgStatus != MsgStatus.recanlled) {
            val gender = this.recalled(messageBO.msgId!!)
            if (null != gender) {
                messageBO.msgStatus = MsgStatus.recanlled
                messageBO.gender = gender
            }
        }
        return messageBO
    }

    override fun chatroomMsgLastTime(req: ChatroomMsgLastTimeReq, user: LoginUserInfo): Boolean {
        return chatroomMemberService.ktUpdate()
            .set(req.type == LastTimeType.READ, ChatroomMember::lastReadTime, LocalDateTime.now())
            .set(req.type == LastTimeType.LOAD, ChatroomMember::lastLoadTime, LocalDateTime.now())
            .`in`(ChatroomMember::roomId, req.roomIds).eq(ChatroomMember::memberId, user.userId)
            .eq(ChatroomMember::status, GroupMemberStatus.APPROVE).update()
    }

    override fun chatroomUnreadNum(time: LocalDateTime, roomId: Int): Int {
        val redisKey = "$CHATROOM_KEY_PREFIX$roomId"
        // 获取 Redis List 中的部分元素
        val list = stringRedisTemplate.opsForList().range(redisKey, 0, maxRecordNum - 1)
        if (CollUtil.isEmpty(list)) {
            return 0
        }
        return convertToChatMessage(list!!).filter {
            it.createdAt!!.isAfter(time) || it.createdAt!!.isEqual(time)
        }.size
    }

    override fun lastMessage(roomId: Int): ChatMessageBO? {
        try {
            val record = stringRedisTemplate.opsForList().index("$CHATROOM_KEY_PREFIX$roomId", 0)
            if (StrUtil.isBlank(record)) {
                return null
            }
            val chatRecord = JSONUtil.toBean(record, GroupChatRecords::class.java)
            return convertChatMessage(chatRecord)
        } catch (e: Exception) {
            StaticLog.error("redis error:{},[{}][{}]", e.message, roomId)
            e.printStackTrace()
        }
        return null
    }

    override fun getChatroomFiles(
        pageNo: Int, pageSize: Int, roomId: Int, fileName: String?, user: LoginUserInfo
    ): PageResult<GroupChatRecords?> {
        chatroomMemberService.ktQuery().eq(ChatroomMember::roomId, roomId).eq(ChatroomMember::memberId, user.userId)
            .eq(ChatroomMember::status, GroupMemberStatus.APPROVE).orderByDesc(ChatroomMember::id).last("limit 1").one()
            ?: throw BusinessException("You are no longer in this chat group.")


        PageHelper.startPage<GroupChatRecords>(pageNo, pageSize)
        val records = this.ktQuery().eq(GroupChatRecords::roid, roomId).ne(GroupChatRecords::ct, ContentType.TEXT)
            .isNotNull(GroupChatRecords::ct).like(StrUtil.isNotBlank(fileName), GroupChatRecords::fn, fileName)
            .orderByDesc(GroupChatRecords::time).list()
        return PageUtil<GroupChatRecords?>().page(records)
    }

    override fun queryChatroomRecords(roomId: Int, limit: Int): List<ChatMessageBO> {
        val records = stringRedisTemplate.opsForList().range("$CHATROOM_KEY_PREFIX$roomId", 0, limit.toLong())
        return convertToChatMessage(records!!)
    }

    override fun getMessageRecord(messageId: String): GroupChatRecords? {
        val cacheInfo = stringRedisTemplate.opsForValue().get("$MESSAGE_KEY$messageId")
        if (StrUtil.isBlank(cacheInfo)) {
            return null
        }
        return JSONUtil.toBean(cacheInfo, GroupChatRecords::class.java)
    }

    override fun recallMessage(messageRecord: GroupChatRecords) {
        val userInfo = userFeignClient.userInfo(messageRecord.uid!!)
        messageRecord.gender = userInfo?.gender
        stringRedisTemplate.opsForValue().set(
            "$RECALL_MESSAGE_FLAG${messageRecord.id}", messageRecord.gender?.name ?: "NON_BINARY", 30, TimeUnit.DAYS
        )
    }

    private fun recalled(msgId: String?): Gender? {
        val genderName = stringRedisTemplate.opsForValue().get("$RECALL_MESSAGE_FLAG$msgId")
        if (StrUtil.isNotBlank(genderName)) {
            if ("1" == genderName) {
                return Gender.NON_BINARY
            }
            return Gender.valueOf(genderName!!)
        }
        return null
    }

    private fun convertToChatMessage(records: List<String?>): List<ChatMessageBO> {
//        StaticLog.info("list:{}", JSONUtil.toJsonStr(records))
        return records.filterNotNull().map { record ->
            JSONUtil.toBean(JSONUtil.toJsonStr(record), GroupChatRecords::class.java)
        }.map(this::convertChatMessage)
    }
}
