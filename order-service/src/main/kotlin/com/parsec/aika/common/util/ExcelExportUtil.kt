package com.parsec.aika.common.util

import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Sheet
import java.beans.PropertyDescriptor

/**
 * excel文件导出工具
 * @author YuLin Yang
 * @since 1.0.0
 *
 * <dependency>
 * <groupId>org.apache.poi</groupId>
 * <artifactId>poi-ooxml</artifactId>
 * <version>4.1.1</version>
 * </dependency>
 */
object ExcelExportUtil {

    /**
     * 根据定义列名与字段名的对应关系和顺序导出excel文件
     * @param sheet excel中的一页
     * @param data 需要导出的数据
     * @param columnToFieldMap 文件中的列与数据的字段的对应关系，列名为key，字段名为value。循环key确定填充位置，通过key获取value确定填充内容。
     */
    fun <T : Any> export(sheet: Sheet, data: List<T>, columnToFieldMap: Map<String, String>) {
        // 根据列名生成标题
        createTitle(sheet.createRow(0), columnToFieldMap.keys.toList())
        // 根据字段名注入内容
        fillData(data, sheet, columnToFieldMap.values.toList())
    }

    private fun createTitle(row: Row, titleList: List<String>) {
        for ((index, item) in titleList.withIndex()) {
            row.createCell(index).setCellValue(item)
        }
    }

    private fun <T : Any> fillData(data: List<T>, sheet: Sheet, fieldName: List<String>) {
        for ((index, item) in data.withIndex()) {
            // 从第二行开始填充数据
            val row = sheet.createRow(index + 1)
            for (i in fieldName.indices) {
                // 根据字段名集合下标决定填充顺序
                val field = item.javaClass.getDeclaredField(fieldName[i])
                field.isAccessible = true
                // 通过get方法拿到属性的值并进行填充
                val value = PropertyDescriptor(field.name, item.javaClass).readMethod.invoke(item)
                row.createCell(i).setCellValue((value ?: "").toString())
            }
        }
    }
}
