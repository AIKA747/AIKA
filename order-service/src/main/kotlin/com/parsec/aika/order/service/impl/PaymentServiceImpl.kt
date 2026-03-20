package com.parsec.aika.order.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.common.mapper.PaymentMapper
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.PayTypeEnum
import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.order.model.vo.req.GetAppPaymentHistoryReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentHistoryResp
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.service.OrderNoGeneratorService
import com.parsec.aika.order.service.OrderService
import com.parsec.aika.order.service.PaymentService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.redisson.api.RedissonClient
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit


@Service
class PaymentServiceImpl : PaymentService {

    @Autowired
    private lateinit var paymentMapper: PaymentMapper

    @Autowired
    private lateinit var orderService: OrderService

    @Autowired
    private lateinit var orderNoGeneratorService: OrderNoGeneratorService

    @Autowired
    private lateinit var redissonClient: RedissonClient

    private final val PAY_LOCK = "order:pay:success:lock:"

    /**
     * 支付历史记录
     */
    override fun getAppPaymentHistory(
        req: GetAppPaymentHistoryReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetAppPaymentHistoryResp> {
        PageHelper.startPage<GetAppPaymentHistoryResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetAppPaymentHistoryResp>().page(paymentMapper.getAppPaymentHistory(loginUserInfo.userId!!))
    }

    /**
     * 支付结果查询
     */
    override fun getAppPaymentResult(orderNo: String): GetAppPaymentResultResp {
        val order =
            paymentMapper.selectOne(KtQueryWrapper(Payment::class.java).eq(Payment::orderNo, orderNo).last("limit 1"))
        Assert.notNull(orderNo, "Order does not exist")
        val resp = GetAppPaymentResultResp()
        BeanUtils.copyProperties(order, resp)
        return resp
    }

    override fun savePaymentInfo(payment: Payment): Payment {
        StaticLog.info("保存支付信息：{}", JSONUtil.toJsonStr(payment))
        paymentMapper.insert(payment)
        return payment
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun paySuccess(
        payNo: String, localDateTime: LocalDateTime, transactionId: String?, receipt: String?
    ): Payment {
        val lock = redissonClient.getLock("$PAY_LOCK$payNo")
        try {
            val tryLock = lock.tryLock(15, TimeUnit.SECONDS)
            //查询支付信息
            val payment = paymentMapper.selectOne(KtQueryWrapper(Payment::class.java).eq(Payment::payNo, payNo))
                ?: throw BusinessException("No payment information found for payment ID [${payNo}]")
            if (payment.status == PayStatusEnum.success) {
                return payment
            }
            if (tryLock) {
                StaticLog.info("支付单号[$payNo],进入支付成功逻辑")
                payment.status = PayStatusEnum.success
                payment.callbackTime = LocalDateTime.now()
                payment.payTime = localDateTime
                payment.transactionId = transactionId
                payment.receipt = receipt
                paymentMapper.updateById(payment)
                orderService.paySuccess(payment.orderNo!!, payment.callbackTime!!)
                StaticLog.info("支付单号[$payNo],处理支付成功逻辑完成")
            } else {
                StaticLog.info("支付单号[$payNo]，支付成功，获取锁失败")
            }
            return payment
        } finally {
            if (lock.isHeldByCurrentThread && lock.isLocked) {
                lock.unlock()
            }
        }
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun payFailed(payNo: String, description: String) {
        //查询支付信息
        val payment = paymentMapper.selectOne(KtQueryWrapper(Payment::class.java).eq(Payment::payNo, payNo))
            ?: throw BusinessException("No payment information found for payment ID [${payNo}]")
        payment.status = PayStatusEnum.fail
        payment.callbackTime = LocalDateTime.now()
        payment.reason = description
        paymentMapper.updateById(payment)
        orderService.payFailed(payment.orderNo, payment.callbackTime!!)
    }

    override fun getAppPaymentTotalAmount(userId: Long?): Long? {
        val selectList = paymentMapper.selectList(
            KtQueryWrapper(Payment::class.java).eq(Payment::creator, userId).eq(Payment::status, PayStatusEnum.success)
        )
        return selectList.sumOf { it.amount!! }
    }

    override fun testPaySuccess(orderNo: String, user: LoginUserInfo): GetAppPaymentResultResp {
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
        Assert.state(order.status != OrderStatusEnum.Cancelled, "Order cancelled")
        Assert.state(order.status != OrderStatusEnum.Success, "Order paid")
        //生成订单支付信息
        val payment = Payment().apply {
            this.orderNo = orderNo
            this.amount = order.amount
            this.payNo = "test-${System.currentTimeMillis()}"
            this.status = PayStatusEnum.success
            this.creator = user.userId
            this.creatorName = user.username
            this.type = PayTypeEnum.Payment
            this.payMethod = PayMethodEnum.Stripe
            this.callbackTime = LocalDateTime.now()
            this.payTime = LocalDateTime.now()
        }
        this.savePaymentInfo(payment)
        orderService.paySuccess(orderNo, payment.callbackTime!!)
        return getAppPaymentResult(orderNo)
    }

    override fun getPaymentInfo(payNo: String): Payment {
        return paymentMapper.selectOne(KtQueryWrapper(Payment::class.java).eq(Payment::payNo, payNo))
            ?: throw BusinessException("No payment information found for payment ID [${payNo}]")
    }

    override fun checkInAppPayReceipt(transactionId: String, receipt: String) {
        val count = paymentMapper.selectCount(
            KtQueryWrapper(Payment::class.java).and { wrapper ->
                wrapper.eq(Payment::transactionId, transactionId).or().eq(Payment::receipt, receipt)

            })
        Assert.state(count == 0, "The payment voucher has been redeemed for the product. Please do not redeem it again")
    }

    override fun zeroPay(order: Order): Order {
        //生成订单支付信息
        val payment = Payment().apply {
            this.orderNo = order.orderNo
            this.amount = order.amount
            this.payNo = orderNoGeneratorService.generateOrderNumber("ZIP")
            this.status = PayStatusEnum.success
            this.creator = order.userId
            this.creatorName = order.username
            this.type = PayTypeEnum.Payment
            this.payMethod = PayMethodEnum.ZeroPay
            this.callbackTime = LocalDateTime.now()
            this.payTime = LocalDateTime.now()
        }
        paymentMapper.insert(payment)
        return orderService.paySuccess(order.orderNo!!, payment.callbackTime!!)
    }
}