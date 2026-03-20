package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.GetManageCountryIncomeRankingReq
import com.parsec.aika.order.model.vo.req.GetManageOrdersReq
import com.parsec.aika.order.model.vo.req.OrderEndpointQueryVo
import com.parsec.aika.order.model.vo.resp.*
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface OrderMapper : BaseMapper<Order> {

    @Select(
        """
        <script>
        select o.id, o.orderNo, o.username, o.amount, o.status, o.createdAt 
        from `order` as o 
        left join payment as p on o.orderNo = p.orderNo and p.status = 'success' and p.type = 'Payment' and p.deleted = 0
        where o.deleted = 0 
        <if test = 'req.orderNo'>
            and o.orderNo = #{req.orderNo}
        </if>
        <if test = 'req.username != null'>
            and o.username like concat('%', #{req.username}, '%')
        </if>
        <if test = 'req.email != null'>
            and o.email like concat('%', #{req.email}, '%')
        </if>
        <if test = 'req.phone != null'>
            and o.phone like concat('%', #{req.phone}, '%')
        </if>
        <if test = 'req.status != null'>
            and o.status = #{req.status}
        </if>
        <if test = 'req.minCreatedAt != null'>
            and o.createdAt &gt;= #{req.minCreatedAt}
        </if>
        <if test = 'req.maxCreatedAt != null'>
            and o.createdAt &lt;= #{req.maxCreatedAt}
        </if>
        <if test = 'req.payMethod != null'>
            and p.payMethod = #{req.payMethod}
        </if>
        <if test = 'req.minPayTime != null'>
            and p.payTime &gt;= #{req.minPayTime}
        </if>
        <if test = 'req.maxPayTime != null'>
            and p.payTime &lt;= #{req.maxPayTime}
        </if>
        order by o.id desc
        </script>
    """
    )
    fun getManageOrders(@Param("req") req: GetManageOrdersReq): List<GetManageOrdersResp>

    @Select(
        """
        
        <script>
        select sum(ifnull(o.amount, 0)) as data, o.country
        from `order` as o 
        where o.deleted = 0 and o.status = 'Success'
        group by o.country
        order by data desc
        </script>
    """
    )
    fun getManageCountryIncomeRanking(@Param("req") req: GetManageCountryIncomeRankingReq): List<GetManageCountryIncomeRankingResp>

    @Select(
        """
        <script>
            select 
                id as orderId, userId, username, email, phone, expiredAt as expiredDate, callbackAt as subscriptTime, DATEDIFF(DATE(expiredAt), DATE(now())) as days
            from `order` 
            where id in (
                SELECT max(id) FROM `order` 
                where status = #{status} and deleted = 0
                <if test = 'query.username != null'>
                    and username like concat('%', #{query.username}, '%')
                </if>
                <if test = 'query.email != null'>
                    and email like concat('%', #{query.email}, '%')
                </if>
                <if test = 'query.phone != null'>
                    and phone like concat('%', #{query.phone}, '%')
                </if>
                <if test = 'query.userIds != null'>
                    and userId in 
                    <foreach collection='query.userIds' open='(' close = ')' item='id' separator=','> 
                        #{id}
                    </foreach>
                </if>
                group by userId
            )
            <if test = 'query.remainingDays != null'>
                and (DATEDIFF(DATE(expiredAt), DATE(now())) &gt;= 0 and #{query.remainingDays} &gt;= DATEDIFF(DATE(expiredAt), DATE(now())))
            </if>
            <if test = 'query.maxSubscriptionTime != null'>
                and callbackAt &lt;= #{query.maxSubscriptionTime} 
            </if>
            <if test = 'query.minSubscriptionTime != null'>
                and callbackAt &gt;= #{query.minSubscriptionTime}
            </if>
           <if test = 'query.subStatus == "Valid"'>
                and expiredAt > now()
            </if>
            <if test = 'query.subStatus == "Expired"'>
                and now() > expiredAt
            </if>
        </script>
    """
    )
    fun feignUserOrderList(
        @Param("query") queryVo: OrderEndpointQueryVo,
        @Param("status") status: OrderStatusEnum
    ): List<FeignUserSubscriptionsListVo>

    @Select(
        """
        select o.orderNo, o.username, o.email, o.phone, o.amount, 
        o.status, DATE_FORMAT(o.createdAt, '%Y-%m-%d %H:%i:%s') as createdAt, p.payMethod, 
        p.payNo, DATE_FORMAT(p.payTime, '%Y-%m-%d %H:%i:%s') as payTime 
        from `order` as o 
        left join payment as p on o.orderNo = p.orderNo and p.deleted = 0 and p.status = 'success' and `type` = 'Payment' 
        where o.deleted = 0 
        order by o.id desc 
    """
    )
    fun getManageExport(): List<GetManageExportResp>

    @Select(
        """
        <script>
        select ifnull(sum(ifnull(o.amount, 0)),0)
        from `order` as o 
        where o.deleted = 0 and o.status = 'Success' and o.country = #{country}
        <if test = 'isTotal == 0'>
            and DATE_FORMAT(o.callbackAt, '%Y-%m-%d') = DATE_FORMAT(#{date}, '%Y-%m-%d')
        </if>
        <if test = 'isTotal == 1'>
            and DATE_FORMAT(o.callbackAt, '%Y-%m-%d') &lt;= DATE_FORMAT(#{date}, '%Y-%m-%d')
        </if>
        </script>
    """
    )
    fun getFeignIncomeData(
        @Param("date") date: String?,
        @Param("country") country: String,
        @Param("isTotal") isTotal: Int
    ): Int


    @Select(
        """
        <script>
        select count(distinct o.userId)
        from `order` as o 
        where o.deleted = 0 and o.status = 'Success' and o.country = #{country}
        <if test = 'isTotal == 0'>
            and DATE_FORMAT(o.callbackAt, '%Y-%m-%d') = DATE_FORMAT(#{date}, '%Y-%m-%d')
        </if>
        <if test = 'isTotal == 1'>
            and DATE_FORMAT(o.callbackAt, '%Y-%m-%d') &lt;= DATE_FORMAT(#{date}, '%Y-%m-%d')
        </if>
        </script>
    """
    )
    fun getFeignSubDataNew(
        @Param("date") date: String?,
        @Param("country") country: String,
        @Param("isTotal") isTotal: Int
    ): Int


    @Select(
        """
        <script>
        select count(distinct o.userId)
        from `order` as o 
        where o.deleted = 0 and o.status = 'Success' and o.country = #{country}
        <if test = 'isTotal == 0'>
            and DATE_FORMAT(o.expiredAt, '%Y-%m-%d') = DATE_FORMAT(#{date}, '%Y-%m-%d')
        </if>
        <if test = 'isTotal == 1'>
            and DATE_FORMAT(o.expiredAt, '%Y-%m-%d') &lt;= DATE_FORMAT(#{date}, '%Y-%m-%d')
        </if>
        </script>
    """
    )
    fun getFeignSubDataExpired(
        @Param("date") date: String?,
        @Param("country") country: String,
        @Param("isTotal") isTotal: Int
    ): Int


    @Select(
        """
        select count(distinct o.userId)
        from `order` as o 
        where o.deleted = 0 and o.status = 'Success'  and o.country = #{country} and DATE_FORMAT(o.expiredAt, '%Y-%m-%d') between DATE_FORMAT(#{date}, '%Y-%m-%d') and DATE_ADD(DATE_FORMAT(#{date}, '%Y-%m-%d'), INTERVAL 7 DAY)
    """
    )
    fun getFeignSubDataUpcomingExpiring(@Param("date") date: String?, @Param("country") country: String): Int


}