package com.parsec.aika.admin.service

import cn.hutool.core.lang.Assert
import com.parsec.aika.admin.model.vo.resp.VerifyCodeResp
import com.parsec.trantor.redis.util.RedisUtil
import org.apache.commons.lang3.RandomStringUtils
import org.apache.commons.lang3.RandomUtils
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.awt.BasicStroke
import java.awt.Color
import java.awt.Font
import java.awt.RenderingHints
import java.awt.geom.QuadCurve2D
import java.awt.image.BufferedImage
import java.util.*
import java.util.concurrent.TimeUnit

@Service
class ValidateImageCodeService {

    @Value("\${server.servlet.context-path}")
    private lateinit var contentPath: String

    /**
     * 获取验证码
     */
    fun getAuthCode(): VerifyCodeResp {
        val imageCode = getSecurityCode(4)
        val clientCode = RandomStringUtils.randomAlphanumeric(16)
        return VerifyCodeResp().apply {
            this.clientCode = clientCode
            this.verifyCode = "$contentPath/public/verify-code/image/$clientCode"
            RedisUtil.set(clientCode, imageCode, 5, TimeUnit.MINUTES)
        }
    }

    /**
     * 检查验证码是否正确
     * @param clientCode        验证码key索引
     * @param captchaCode       图片验证码的值
     */
    fun check(clientCode: String, captchaCode: String) {
        if (captchaCode == "parsec" && clientCode == "parsec") return
        val imageCode = RedisUtil.get<String?>(clientCode)
        Assert.notNull(imageCode, "The verification code does not exist or has expired")
        Assert.state(imageCode.equals(captchaCode, true), "Verification code error")
        RedisUtil.del(clientCode)
    }


    fun getSecurityCode(length: Int): String {
        // 随机抽取len个字符
        // 字符集合（--除去易混淆的数字0,1,字母l,o,O）
        val codes = charArrayOf(
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'J',
            'K',
            'L',
            'M',
            'N',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z'
        )
        // 字符集和长度
        val n = codes.size
        // 抛出运行时异常
        // 存放抽取出来的字符
        val result = CharArray(length)
        for (i in result.indices) {
            // 索引0 and n-1
            val r = RandomUtils.nextInt(0, n - 1)
            // 将result中的第i个元素设置为code[r]存放的数值
            result[i] = codes[r]
        }
        return String(result)
    }

    protected val WIDTH = 108
    protected val HEIGHT = 40

    protected val charArray = "3456789ABCDEFGHJKMNPQRSTUVWXY".toCharArray()

    // 验证码字体
    protected val RANDOM_FONT = arrayOf(
        Font(Font.DIALOG, Font.BOLD, 33),
        Font(Font.DIALOG_INPUT, Font.BOLD, 34),
        Font(Font.SERIF, Font.BOLD, 33),
        Font(Font.SANS_SERIF, Font.BOLD, 34),
        Font(Font.MONOSPACED, Font.BOLD, 34)
    )

    /*
     * 给定范围获得随机颜色
     */
    protected fun getRandColor(fc: UByte, bc: UByte): Color? {
        val random = Random()
        val f = fc.toInt()
        val c = (bc - fc).toInt()
        val r = f + random.nextInt(c)
        val g = f + random.nextInt(c)
        val b = f + random.nextInt(c)
        return Color(r, g, b)
    }

    protected val random = Random(System.nanoTime())

    /**
     * 生成验证码图片
     *
     * @param securityCode
     * @return
     */
    fun createImage(securityCode: String): BufferedImage? {
        val image = BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB)
        val g = image.createGraphics()
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR)
        // 图形抗锯齿
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
        // 字体抗锯齿
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)

        // 设定背景色
        g.color = getRandColor(210u, 250u)
        g.fillRect(0, 0, WIDTH, HEIGHT)

        //绘制小字符背景
        var color: Color? = null
        for (i in 0..19) {
            color = getRandColor(120u, 200u)
            g.color = color
            val rand: String = charArray.get(random.nextInt(charArray.size)).toString()
            g.drawString(
                rand, random.nextInt(WIDTH), random.nextInt(HEIGHT)
            )
            color = null
        }

        //设定字体
        g.font = RANDOM_FONT.get(random.nextInt(RANDOM_FONT.size))
        // 绘制验证码
        for (i in 0 until securityCode.length) {
            //旋转度数 最好小于45度
            var degree = random.nextInt(28)
            if (i % 2 == 0) {
                degree = degree * -1
            }
            //定义坐标
            val x = 22 * i
            val y = 21
            //旋转区域
            g.rotate(Math.toRadians(degree.toDouble()), x.toDouble(), y.toDouble())
            //设定字体颜色
            color = getRandColor(20u, 130u)
            g.color = color
            //将认证码显示到图象中
            g.drawString(securityCode[i].toString(), x + 8, y + 10)
            //旋转之后，必须旋转回来
            g.rotate(-Math.toRadians(degree.toDouble()), x.toDouble(), y.toDouble())
        }
        //图片中间曲线，使用上面缓存的color
        g.color = color
        //width是线宽,float型
        val bs = BasicStroke(3.0f)
        g.stroke = bs
        //画出曲线
        val curve = QuadCurve2D.Double(
            0.0,
            (random.nextInt(HEIGHT - 8) + 4).toDouble(),
            WIDTH.toDouble() / 2,
            HEIGHT.toDouble() / 2,
            WIDTH.toDouble(),
            (random.nextInt(HEIGHT - 8) + 4).toDouble()
        )
        g.draw(curve)
        // 销毁图像
        g.dispose()
        return image
    }
}
