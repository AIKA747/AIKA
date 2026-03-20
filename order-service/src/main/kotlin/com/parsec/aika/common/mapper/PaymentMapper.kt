package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.order.model.vo.req.GetAppPaymentHistoryReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentHistoryResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface PaymentMapper : BaseMapper<Payment> {

    @Select(
        """
        select p.payMethod, p.amount, p.payTime,  p.refundNo,p.orderNo,o.packageId,o.packageName,
        GREATEST(DATE_ADD(o.callbackAt, INTERVAL s.subPeriod DAY),o.expiredAt) as expiredAt 
        from payment as p 
        left join `order` as o on p.orderNo=o.orderNo
        left join service_package  as s on o.packageId=s.id
        where p.deleted = 0 and p.creator=#{userId} and p.status='success'
        order by p.id desc 
    """
    )
    fun getAppPaymentHistory(
        @Param("userId") userId: Long
    ): List<GetAppPaymentHistoryResp>
}