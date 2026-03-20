package com.parsec.aika.bot.service.impl

import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.AppChatroomCreatReq
import com.parsec.aika.bot.model.vo.req.ManageChatroomEditReq
import com.parsec.aika.bot.service.AppChatroomService
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.bot.service.ChatroomService
import com.parsec.aika.bot.service.GroupChatRecordsService
import com.parsec.aika.common.mapper.ChatroomMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.em.ChatroomGroupTypeEnum
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource

/**
 * @author 77923
 * @description 针对表【t_chatroom】的数据库操作Service实现
 * @createDate 2025-02-24 11:52:50
 */
@Service
class ChatroomServiceImpl : ServiceImpl<ChatroomMapper?, Chatroom?>(), ChatroomService {

    @Resource
    private lateinit var appChatroomService: AppChatroomService

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @Lazy
    @Autowired
    private lateinit var groupChatRecordsService: GroupChatRecordsService

    override fun chatroomUnreadNum(lastReadTime: LocalDateTime, chatroomId: Int): Int {
        return groupChatRecordsService.chatroomUnreadNum(lastReadTime, chatroomId)
    }

    override fun lastMessage(roomId: Int): ChatMessageBO? {
        return groupChatRecordsService.lastMessage(roomId)
    }

    override fun groupChatList(pageNo: Int, pageSize: Int, searchContent: String?): PageResult<Chatroom?>? {
        PageHelper.startPage<Chatroom>(pageNo, pageSize)
        val chatrooms =
            this.ktQuery().eq(Chatroom::creatorType, UserTypeEnum.ADMINUSER).and(StrUtil.isNotBlank(searchContent)) {
                it.like(Chatroom::description, searchContent).or().like(Chatroom::roomName, searchContent)
            }.orderByDesc(Chatroom::createdAt).list()
        return PageUtil<Chatroom?>().page(chatrooms)
    }

    override fun createChatroom(req: ManageChatroomEditReq, userInfo: LoginUserInfo): Int {
        return appChatroomService.createChatroom(AppChatroomCreatReq().apply {
            this.roomName = req.roomName
            this.groupType = ChatroomGroupTypeEnum.PUBLIC
            this.roomAvatar = req.roomAvatar
            this.description = req.description
            this.ownerId = req.ownerId
        }, userInfo)
    }

    override fun updateChatroom(req: ManageChatroomEditReq, userInfo: LoginUserInfo): Boolean? {
        return this.ktUpdate()
            .set(StrUtil.isNotBlank(req.roomName), Chatroom::roomName, req.roomName)
            .set(StrUtil.isNotBlank(req.roomAvatar), Chatroom::roomAvatar, req.roomAvatar)
            .set(StrUtil.isNotBlank(req.description), Chatroom::description, req.description)
            .set(Chatroom::updater, userInfo.userId)
            .eq(Chatroom::id, req.id)
            .update()
    }

    @Transactional
    override fun deleteChatroom(id: Int): Boolean? {
        this.removeById(id)
        return chatroomMemberService.ktUpdate()
            .eq(ChatroomMember::roomId, id)
            .remove()
    }

}




