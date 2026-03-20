package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.ServicePackage
import com.parsec.aika.order.model.vo.req.ManageServicePackageQueryVo
import com.parsec.aika.order.model.vo.resp.AppServicePackageVo
import com.parsec.aika.order.model.vo.resp.ManageServicePackageListVo
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import org.apache.ibatis.annotations.Update

@Mapper
interface ServicePackageMapper: BaseMapper<ServicePackage> {

    @Select("""
        <script>
            select * from service_package where deleted = 0
            <if test = 'query.packageName != null'> 
                and packageName like concat('%', #{query.packageName}, '%')
            </if>
            <if test = 'query.status != null'> 
                and status = #{query.status}
            </if>
            <if test = 'query.visiblity != null'> 
                and visiblity = #{query.visiblity}
            </if>
            <if test = 'query.minCreatedAt != null and query.maxCreatedAt != null'> 
                and (UNIX_TIMESTAMP(createdAt) >= UNIX_TIMESTAMP(#{query.minCreatedAt})
                    and UNIX_TIMESTAMP(#{query.maxCreatedAt}) >= UNIX_TIMESTAMP(createdAt))
            </if>
            order by createdAt desc
        </script>
    """)
    fun manageList(@Param("query") queryVo: ManageServicePackageQueryVo): List<ManageServicePackageListVo>


    /**
     * app端查询列表，需未删除、已激活、可见
     */
    @Select("""
        <script>
            select * from service_package
            where deleted = 0 and status = 'Active' and visiblity = 1
            order by sortNo desc,createdAt desc
        </script>
    """)
    fun appList(): List<AppServicePackageVo>

}