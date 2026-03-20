package com.parsec.aika.bot.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.service.*
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.entity.GroupChatRecords
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@Service
class GroupMessageServiceImpl : GroupMessageService {

    @Autowired
    private lateinit var notificationService: NotificationService

    @Resource
    private lateinit var groupChatRecordsService: GroupChatRecordsService

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @Resource
    private lateinit var userOnlineService: UserOnlineService

    @Resource
    private lateinit var chatroomService: ChatroomService

    @Autowired
    private lateinit var chatService: ChatService

    @Autowired
    private lateinit var botService: BotService

    override fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        //获取用户聊天的消息体
        val chatMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ChatMessageBO::class.java)
        //查询当前用户是否为该群聊成员
        val chatroomMember = chatroomMemberService.ktQuery().eq(ChatroomMember::roomId, chatMessageBO.objectId)
            .eq(ChatroomMember::memberId, chatMessageBO.userId).eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
            .last("limit 1").one() ?: throw BusinessException("You are no longer in this chat group.")
        //构建聊天记录对象
        val chatRecord = GroupChatRecords().apply {
            this.uid = chatMessageBO.userId!!.toLong()
            this.st = chatMessageBO.sourceType!!
            this.ct = chatMessageBO.contentType
            this.avatar = chatroomMember.avatar
            this.nn = chatroomMember.nickname
            this.txt = chatMessageBO.textContent
            this.med = chatMessageBO.media
            this.rid = chatMessageBO.replyMessageId
            this.rmessage = chatMessageBO.replyMessage
            if (StrUtil.isNotBlank(chatMessageBO.fileProperty)) {
                val fileProp = JSONObject(chatMessageBO.fileProperty)
                this.fn = fileProp.getStr("fileName")
                this.flength = fileProp.getDouble("length")
                this.fileProp = chatMessageBO.fileProperty
            }
            this.time = chatMessageBO.createdAt ?: LocalDateTime.now()
            this.roid = chatMessageBO.objectId!!.toInt()
            this.json = chatMessageBO.json
            this.memberIds = chatMessageBO.memberIds
            this.forwardInfo = chatMessageBO.forwardInfo
            this.username = chatroomMember.username
        }
        //保存消息记录
        val roomId = chatMessageBO.objectId!!.toInt()
        //给群成员推送消息
        this.sendChatMsgToGroupMember(roomId, chatRecord)
        //响应接收消息成功
        chatService.respChatMsg(user, baseMessageDTO.successResp(chatRecord.id.toString()))
        //判断是否存在@的机器人成员
        if (StrUtil.isNotBlank(chatMessageBO.memberIds)) {
            this.handlerAbotMsg(roomId, chatMessageBO.memberIds!!, chatRecord)
        }
    }

    override fun sendChatMsgToGroupMember(roomId: Int, record: GroupChatRecords) {
        if (record.status != MsgStatus.recanlled) {
            //保存聊天记录
            groupChatRecordsService.saveChatRecord(roomId, record)
        }
        //查询群聊信息
        val chatroom = chatroomService.getById(roomId) ?: throw BusinessException("room not exist")
        //查询群成员列表
        val roomMembers = chatroomMemberService.queryRoomMembers(roomId)
        //并发推送消息给群成员
        val list = roomMembers.filterNotNull()
            //过滤掉发消息的用户
            .filter {
                it.memberId != record.uid
            }
            //过滤掉机器人成员
            .filter {
                it.memberType != AuthorType.BOT
            }
            //如果用户A加入群聊消息，A加入群聊消息不推给用户A
            .filter {
                if (record.ct == ContentType.memberChange) {
                    val obj = JSONObject(record.json)
                    val type = obj.getStr("type")
                    val memberId = obj.getLong("memberId")
                    return@filter !(type == "join" && memberId == record.uid)
                } else {
                    return@filter true
                }
            }.toList()
        if (CollUtil.isEmpty(list)) {
            StaticLog.info("群聊「${chatroom.roomName}」暂无群成员,跳过消息推送")
            return
        }
        record.roomName = chatroom.roomName
        record.roomAvatar = chatroom.roomAvatar
        //记录最后一次消息记录时间
        chatroomService.ktUpdate().set(Chatroom::lastMessageTime, record.time ?: LocalDateTime.now())
            .eq(Chatroom::id, roomId).update()
        //推送实时消息
        list.parallelStream().forEach {
            //推送消息用户
            val user = "APPUSER${it.memberId}"
            val baseMessageDTO = BaseMessageDTO().apply {
                this.msgType = MsgType.CHAT_MSG
                this.avatar = record.avatar
                this.nickname = record.nn
                this.sessionId = "APPUSER-${it.memberId}-group-${roomId}"
                this.chatModule = ChatModule.group
            }
            val chatMessageBO = groupChatRecordsService.convertChatMessage(record)
            chatService.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
        }
        val userIds = ArrayList<Long>()
        //推送离线消息
        list.parallelStream().forEach {
            //判断用户是否在线
            val online = userOnlineService.online(it.memberId!!)
            //若不在线，需要推送firebase通知
            if (!online) {
                //判断用户关闭通知设置
                if (null == it.notifyTurnOffTime || LocalDateTime.now().isAfter(it.notifyTurnOffTime)) {
                    userIds.add(it.memberId!!)
                }
            }
        }
        if (CollUtil.isNotEmpty(userIds)) {
            val content = if (record.ct == ContentType.TEXT) {
                StrUtil.sub(record.txt, 0, 50)
            } else {
                "[${record.ct}]"
            }
            //推送消息通知
            notificationService.chatroomMessageNotify(userIds, content, chatroom.roomAvatar!!, roomId)
        }
    }

    override fun handlerAbotMsg(roomId: Int, memberIds: String, chatRecord: GroupChatRecords) {
        //查询@的成员列表
        val aMemeberIds = memberIds.split(",")
        val chatroomMembers = chatroomMemberService.ktQuery().eq(ChatroomMember::roomId, roomId)
            .eq(ChatroomMember::memberType, AuthorType.BOT).`in`(ChatroomMember::memberId, aMemeberIds).list()
        if (CollUtil.isNotEmpty(chatroomMembers)) {
            chatroomMembers.filterNotNull().forEach { member ->
                //通过群聊记录构建回复消息
                var replyMsg = botService.replayAMsg(roomId, member.memberId!!)
                if (StrUtil.isNotBlank(replyMsg)) {
                    if (!replyMsg!!.contains("@${chatRecord.username}")) {
                        replyMsg = "@${chatRecord.username} ${replyMsg}"
                    }
                    //发送回复消息到群聊
                    this.sendChatMsgToGroupMember(roomId, GroupChatRecords().apply {
                        this.roid = roomId
                        this.uid = member.memberId
                        this.st = SourceTypeEnum.bot
                        this.ct = ContentType.TEXT
                        this.avatar = member.avatar
                        this.nn = member.nickname
                        this.txt = replyMsg
                        this.time = LocalDateTime.now()
                        this.rid = chatRecord.id
                        this.rmessage = chatRecord.txt
                        this.memberIds = chatRecord.uid.toString()
                        this.json = JSONUtil.toJsonStr(groupChatRecordsService.convertChatMessage(chatRecord))
                    })
                }
            }
        }
    }

    override fun handlerRecallMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        val messageRecord = groupChatRecordsService.getMessageRecord(baseMessageDTO.clientMsgId!!)
        if (null == messageRecord) {
            StaticLog.info("Message recall failed, message[{}] not exist", baseMessageDTO.clientMsgId)
            chatService.respChatMsg(
                user, baseMessageDTO.failResp("Message recall failed")
            )
            return
        }
        //校验是否为撤回自己的消息
        if (user != "APPUSER${messageRecord.uid}") {
            StaticLog.info("撤回失败，只能撤回自己的消息, {} === {}", user, "APPUSER${messageRecord.uid}")
            chatService.respChatMsg(
                user, baseMessageDTO.failResp("Message recall failed")
            )
            return
        }
        //响应接收消息成功
        chatService.respChatMsg(user, baseMessageDTO.successResp(messageRecord.id.toString()))
        //修改消息状态
        messageRecord.status = MsgStatus.recanlled
        groupChatRecordsService.recallMessage(messageRecord)
        //推送消息
        this.sendChatMsgToGroupMember(messageRecord.roid!!, messageRecord)
    }


}