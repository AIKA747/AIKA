package com.parsec.aika.common.util


import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.ss.usermodel.*
import org.apache.poi.ss.util.CellRangeAddress
import org.apache.poi.xssf.usermodel.XSSFSheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.web.multipart.MultipartFile

import javax.servlet.http.HttpServletResponse
import java.io.FileNotFoundException
import java.io.IOException
import java.io.OutputStream

/*
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>3.14</version>
</dependency>
 */


/**
 * POI操作Excel工具类 for parsec team
 * 代码来源于网上
 * code review by xujiahong
 */
class ExcelUtil {


    companion object {
        private val xls = "xls"
        private val xlsx = "xlsx"

        /**
         * 合并单元格
         * firstRow, firstCol第一个cell的行和列（≥0）
         * lastRow, lastCol第二个cell的行和列（≥0）
         */
        fun mergeCells(sheet: XSSFSheet, firstRow: Int, firstCol: Int, lastRow: Int, lastCol: Int): XSSFSheet {
            sheet.addMergedRegion(CellRangeAddress(firstRow, lastRow, firstCol, lastCol))
            return sheet
        }

        /**
         * 导出Excel文件
         * 1. 把xssfWorkbook的内容写入response中
         * 2. 设置headers
         */
        fun exportExcel(response: HttpServletResponse, xssfWorkbook: XSSFWorkbook, fileName: String) {
            var ouputStream: OutputStream? = null
            try {
                val fn = String(fileName.toByteArray(charset("utf-8")), charset("iso-8859-1"))

                response.setHeader("Content-disposition", "attachment;filename=$fn.xlsx")
                response.contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                //response.contentType = "application/vnd.ms-excel;charset=UTF-8"

                ouputStream = response.outputStream
                xssfWorkbook.write(ouputStream)

            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                if (ouputStream != null) {
                    try {
                        ouputStream.flush()
                        ouputStream.close()
                    } catch (e: IOException) {
                        e.printStackTrace()
                    }

                }
            }
        }

        /**
         * 读入excel文件，解析后返回
         * @param file Controller参数，示例：「@RequestParam MultipartFile file」
         * @throws IOException
         * @author internet
         */
        @Throws(IOException::class)
        fun readExcel(file: MultipartFile): ArrayList<ArrayList<String>> {
            //检查文件
            checkFile(file)
            //获得Workbook工作薄对象
            val workbook = getWorkBook(file)
            //创建返回对象，把每行中的值作为一个数组，所有行作为一个集合返回
            val list = ArrayList<ArrayList<String>>()
            if (workbook != null) {
                for (sheetNum in 0 until workbook.numberOfSheets) {
                    //获得当前sheet工作表
                    val sheet = workbook.getSheetAt(sheetNum) ?: continue
                    //获得当前sheet的开始行
                    val firstRowNum = sheet.firstRowNum
                    //获得当前sheet的结束行
                    val lastRowNum = sheet.lastRowNum
                    //循环除了第一行的所有行
                    for (rowNum in firstRowNum + 1..lastRowNum) {
                        //获得当前行
                        val row = sheet.getRow(rowNum) ?: continue
                        //获得当前行的开始列
                        val firstCellNum = row.firstCellNum.toInt()
                        //将标题行的物理列数作为每行列数 by xujiahong since 2020-01-19 15:33:11
                        val lastCellNum = sheet.getRow(firstRowNum).physicalNumberOfCells
                        val cells = arrayOfNulls<String>(lastCellNum)

                        //一个标记，默认当前行所有数据都为空
                        var allDataIsNull = true

                        //循环当前行
                        for (cellNum in firstCellNum until lastCellNum) {
                            val cell = row.getCell(cellNum)
                            val cellValue =
                                if ("" == getCellValue(cell).trim { it <= ' ' }) null else getCellValue(cell)
                            if (cellValue != null) {
                                allDataIsNull = false
                            }
                            cells[cellNum] = cellValue
                        }

                        val cellList = arrayListOf<String>()
                        cells.map {
                            cellList.add(it.toString())
                        }
                        //如果当前行有任意数据，返回当前行数据
                        if (!allDataIsNull) {
                            list.add(cellList)
                        }
                    }
                }
                workbook.close()
            }
            return list
        }

        /**
         * 校验文件
         *
         * @param file
         * @throws IOException
         * @author internet
         */
        @Throws(IOException::class)
        private fun checkFile(file: MultipartFile?) {
            //判断文件是否存在
            if (null == file) {
                throw FileNotFoundException("文件不存在！")
            }
            //获得文件名
            val fileName = file.originalFilename
            //判断文件是否是excel文件
            if (!fileName!!.endsWith(xls) && !fileName.endsWith(xlsx)) {
                throw IOException(fileName + "不是excel文件")
            }
        }

        /**
         * 将上传的Excel文件读取为 Workbook 对象
         *
         * @param file
         * @return
         * @throws IOException
         * @author internet
         */
        @Throws(IOException::class)
        fun getWorkBook(file: MultipartFile): Workbook? {
            //获得文件名
            val fileName = file.originalFilename
            //创建Workbook工作薄对象，表示整个excel
            var workbook: Workbook? = null
            //获取excel文件的io流
            val `is` = file.inputStream
            //根据文件后缀名不同(xls和xlsx)获得不同的Workbook实现类对象
            if (fileName!!.endsWith(xls)) {
                //2003
                workbook = HSSFWorkbook(`is`)
            } else if (fileName.endsWith(xlsx)) {
                //2007
                workbook = XSSFWorkbook(`is`)
            }
            return workbook
        }

        /**
         * 读取单元格的值
         */
        fun getCellValue(cell: Cell?): String {
            var cellValue = ""
            if (cell == null) {
                return cellValue
            } else {
                when (cell.cellType) {
                    CellType.NUMERIC -> cellValue = cell.numericCellValue.toString()
                    CellType.STRING -> cellValue = cell.stringCellValue.toString()
                    CellType.BOOLEAN -> cellValue = cell.booleanCellValue.toString()
                    CellType.FORMULA -> cellValue = cell.cellFormula.toString()
                    CellType.BLANK -> cellValue = ""
                    CellType.ERROR -> cellValue = "非法字符"
                    else -> cellValue = "未知类型"
                }

                return cellValue
            }
        }
    }
}
