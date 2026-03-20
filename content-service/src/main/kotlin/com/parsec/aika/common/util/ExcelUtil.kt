package com.parsec.aika.common.util

import org.apache.poi.ss.usermodel.*
import org.apache.poi.xssf.usermodel.XSSFWorkbook

object ExcelUtil {

    /**
     * 将二维列表写入到 sheet 中
     */
    fun writeDataToSheet(data: List<List<String>>, sheet: Sheet, workbook: XSSFWorkbook) {
        data.forEachIndexed { rowIndex, rowData ->
            val row = sheet.createRow(rowIndex)
            rowData.forEachIndexed { cellIndex, cellValue ->
                row.createCell(cellIndex).setCellValue(cellValue)
            }
        }
        //自动设置单元格宽高
        this.autoSizeColumns(sheet, workbook)
    }

    private fun autoSizeColumns(sheet: Sheet, workbook: Workbook) {
        for (col in 0 until sheet.getRow(0).lastCellNum) {
            var columnWidth = 0
            val rowIterator = sheet.rowIterator()

            // 创建带边框的样式
            val cellStyle = workbook.createCellStyle()
            cellStyle.borderTop = BorderStyle.THIN
            cellStyle.borderBottom = BorderStyle.THIN
            cellStyle.borderLeft = BorderStyle.THIN
            cellStyle.borderRight = BorderStyle.THIN
            cellStyle.alignment = HorizontalAlignment.CENTER       // 水平居中
            cellStyle.verticalAlignment = VerticalAlignment.CENTER  // 垂直居中
            while (rowIterator.hasNext()) {
                val row = rowIterator.next()
                row.heightInPoints = 20f // 设置行高为 20

                val cell = row.getCell(col)
                if (cell != null) {
                    val text = when (cell.cellType) {
                        CellType.STRING -> cell.stringCellValue
                        CellType.NUMERIC -> cell.numericCellValue.toString()
                        CellType.BOOLEAN -> cell.booleanCellValue.toString()
                        CellType.FORMULA -> cell.cellFormula
                        else -> continue
                    }
                    val textLength = text.length
                    columnWidth = maxOf(columnWidth, textLength)
                    cell.cellStyle = cellStyle
                }
            }
            // 设置列宽，单位是 1/256 of a character width
            val newWidth = (columnWidth + 5) * 256
            sheet.setColumnWidth(col, newWidth)
        }
    }
}