package com.parsec.aika.user.service.impl

import com.parsec.aika.user.service.VideoThumbnailService
import org.springframework.stereotype.Service
import java.io.File


@Service
class VideoThumbnailServiceImpl : VideoThumbnailService {
//    override fun generateThumbnail(file: File, frameTimeInSeconds: Int): File {
//        val grabber = FFmpegFrameGrabber(file)
//        try {
//            grabber.start()
//            // 跳到指定时间点（单位：秒）
//            grabber.timestamp = frameTimeInSeconds * 1000000L // 微秒为单位
//            // 抓取帧
//            val frame = grabber.grabImage() ?: throw IOException("无法在指定时间点获取视频帧")
//            // 转换帧为BufferedImage
//            val converter = Java2DFrameConverter()
//            val bufferedImage = converter.getBufferedImage(frame)
//            // 确保输出目录存在
//            val outputFile = FileUtil.createTempFile()
//            // 保存为图片文件
//            ImageIO.write(bufferedImage, "jpg", outputFile)
//            return outputFile
//        } finally {
//            grabber.stop()
//            grabber.release()
//        }
//    }
}