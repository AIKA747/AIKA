package com.parsec.aika.common.hander

import com.alibaba.fastjson.JSONArray
import org.apache.ibatis.type.BaseTypeHandler
import org.apache.ibatis.type.JdbcType
import org.apache.ibatis.type.MappedJdbcTypes
import org.apache.ibatis.type.MappedTypes
import java.sql.CallableStatement
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.sql.SQLException

/**
 * @Author: Mickey
 * @Date: 2019/7/1 10:22
 * @Version 1.0
 */
@MappedTypes(JSONArray::class)
@MappedJdbcTypes(JdbcType.VARCHAR)
class JsonArrayTypeHandler : BaseTypeHandler<JSONArray?>() {
    /**
     * 设置非空参数
     *
     * @param ps
     * @param i
     * @param parameter
     * @param jdbcType
     * @throws SQLException
     */
    @Throws(SQLException::class)
    override fun setNonNullParameter(ps: PreparedStatement?, i: Int, parameter: JSONArray?, jdbcType: JdbcType?) {
        ps?.setString(i, parameter?.toJSONString().toString())
    }

    /**
     * 根据列名，获取可以为空的结果
     *
     * @param rs
     * @param columnName
     * @return
     * @throws SQLException
     */
    @Throws(SQLException::class)
    override fun getNullableResult(rs: ResultSet, columnName: String?): JSONArray? {
        val sqlJson = rs.getString(columnName)
        if (null != sqlJson) {
            return JSONArray.parseArray(sqlJson)
        }
        return null
    }

    /**
     * 根据列索引，获取可以为空的结果
     *
     * @param rs
     * @param columnIndex
     * @return
     * @throws SQLException
     */
    @Throws(SQLException::class)
    override fun getNullableResult(rs: ResultSet, columnIndex: Int): JSONArray? {
        val sqlJson = rs.getString(columnIndex)
        if (null != sqlJson) {
            return JSONArray.parseArray(sqlJson)
        }
        return null
    }

    @Throws(SQLException::class)
    override fun getNullableResult(cs: CallableStatement, columnIndex: Int): JSONArray? {
        val sqlJson = cs.getString(columnIndex)
        if (null != sqlJson) {
            return JSONArray.parseArray(sqlJson)
        }
        return null
    }
}


